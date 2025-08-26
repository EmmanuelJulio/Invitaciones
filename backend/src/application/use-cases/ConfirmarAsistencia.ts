import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { AcompananteRepository } from '../../domain/repositories/AcompananteRepository';
import { Acompanante } from '../../domain/entities/Acompanante';
import { Token } from '../../domain/value-objects/Token';
import { ConfirmarAsistenciaDto, AcompananteCreacionDto } from '../dtos/ConfirmarAsistenciaDto';
import { InvitadoResponseDto, AcompananteDto } from '../dtos/InvitadoResponseDto';
import { InvitacionConfirmada } from '../../domain/events/InvitacionConfirmada';
import { v4 as uuidv4 } from 'uuid';

export class ConfirmarAsistencia {
  constructor(
    private readonly invitadoRepository: InvitadoRepository,
    private readonly acompananteRepository: AcompananteRepository
  ) {}

  async execute(dto: ConfirmarAsistenciaDto): Promise<InvitadoResponseDto> {
    try {
      const token = Token.fromString(dto.token);
      const invitado = await this.invitadoRepository.findByToken(token);
      
      if (!invitado) {
        throw new Error('Invitado no encontrado');
      }

      // Confirmar o rechazar según el flag
      if (dto.confirmado) {
        // Solo confirmar si no está ya confirmado
        if (!invitado.isConfirmado() && !invitado.isConfirmadoIncompleto()) {
          invitado.confirmarAsistencia(dto.mensaje);
        }
        // Si ya está confirmado, solo procesamos acompañantes sin cambiar el estado inicial
        
        // Manejar acompañantes según el tipo de invitación
        const maximoAcompanantes = invitado.getMaximoAcompanantes();
        
        if (maximoAcompanantes > 0) {
          // Solo para invitaciones que requieren acompañantes
          if (dto.acompanantes && dto.acompanantes.length > 0) {
            // Primero eliminar acompañantes existentes para evitar duplicados
            await this.acompananteRepository.deleteByInvitadoId(invitado.getId());
            
            // Crear los nuevos acompañantes
            for (const acompDto of dto.acompanantes) {
              if (acompDto.nombreCompleto.trim()) { // Solo crear si tiene nombre
                const acompanante = Acompanante.create(
                  uuidv4(),
                  invitado.getId(),
                  acompDto.nombreCompleto,
                  acompDto.telefono
                );
                await this.acompananteRepository.save(acompanante);
              }
            }
          }
          
          // Verificar si la invitación está completa solo para invitaciones con acompañantes
          const acompanantesCreados = await this.acompananteRepository.findByInvitadoId(invitado.getId());
          
          if (acompanantesCreados.length >= maximoAcompanantes) {
            // Marcar como confirmado completo si tiene todos los acompañantes
            if (invitado.isConfirmadoIncompleto()) {
              invitado.confirmarAsistenciaCompleta();
            }
          }
        }
        // Para invitaciones individuales (maximoAcompanantes === 0), no hacer nada adicional
        // ya que el método confirmarAsistencia() en la entidad las marca correctamente como confirmadas
      } else {
        invitado.rechazarAsistencia(dto.mensaje);
      }

      // Guardar cambios
      const invitadoActualizado = await this.invitadoRepository.update(invitado);

      // Emitir evento de dominio (para futuras notificaciones)
      const evento = new InvitacionConfirmada(
        invitadoActualizado,
        dto.confirmado ? 'confirmado' : 'rechazado'
      );

      // Obtener acompañantes actualizados
      const acompanantes = await this.acompananteRepository.findByInvitadoId(invitadoActualizado.getId());
      
      return {
        id: invitadoActualizado.getId(),
        nombre: invitadoActualizado.getNombre(),
        telefono: invitadoActualizado.getTelefono(),
        token: invitadoActualizado.getTokenValue(),
        estado: invitadoActualizado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado' | 'confirmado_incompleto',
        mensaje: invitadoActualizado.getMensaje(),
        fechaConfirmacion: invitadoActualizado.getFechaConfirmacion()?.toISOString(),
        fechaCreacion: invitadoActualizado.getFechaCreacion().toISOString(),
        cantidadInvitaciones: invitadoActualizado.getCantidadInvitaciones(),
        fechaLimiteEdicion: invitadoActualizado.getFechaLimiteEdicion().toISOString(),
        whatsappEnviado: invitadoActualizado.getWhatsappEnviado(),
        acompanantes: acompanantes.map(acomp => ({
          id: acomp.getId(),
          nombreCompleto: acomp.getNombreCompleto(),
          telefono: acomp.getTelefono(),
          invitadoId: acomp.getInvitadoId()
        }))
      };
    } catch (error) {
      throw new Error(`Error al confirmar asistencia: ${(error as Error).message}`);
    }
  }
}