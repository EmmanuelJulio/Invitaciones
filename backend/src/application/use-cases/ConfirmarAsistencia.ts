import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { Token } from '../../domain/value-objects/Token';
import { ConfirmarAsistenciaDto } from '../dtos/ConfirmarAsistenciaDto';
import { InvitadoResponseDto } from '../dtos/InvitadoResponseDto';
import { InvitacionConfirmada } from '../../domain/events/InvitacionConfirmada';

export class ConfirmarAsistencia {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(dto: ConfirmarAsistenciaDto): Promise<InvitadoResponseDto> {
    try {
      const token = Token.fromString(dto.token);
      const invitado = await this.invitadoRepository.findByToken(token);
      
      if (!invitado) {
        throw new Error('Invitado no encontrado');
      }

      // Confirmar o rechazar según el flag
      if (dto.confirmado) {
        invitado.confirmarAsistencia(dto.mensaje);
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

      return {
        id: invitadoActualizado.getId(),
        nombre: invitadoActualizado.getNombre(),
        telefono: invitadoActualizado.getTelefono(),
        token: invitadoActualizado.getTokenValue(),
        estado: invitadoActualizado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado',
        mensaje: invitadoActualizado.getMensaje(),
        fechaConfirmacion: invitadoActualizado.getFechaConfirmacion()?.toISOString(),
        fechaCreacion: invitadoActualizado.getFechaCreacion().toISOString()
      };
    } catch (error) {
      throw new Error(`Error al confirmar asistencia: ${(error as Error).message}`);
    }
  }
}