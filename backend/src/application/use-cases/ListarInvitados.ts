import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { AcompananteRepository } from '../../domain/repositories/AcompananteRepository';
import { InvitadoResponseDto, EstadisticasDto } from '../dtos/InvitadoResponseDto';

export class ListarInvitados {
  constructor(
    private readonly invitadoRepository: InvitadoRepository,
    private readonly acompananteRepository: AcompananteRepository
  ) {}

  async execute(): Promise<InvitadoResponseDto[]> {
    try {
      const invitados = await this.invitadoRepository.findAll();
      
      const invitadosConAcompanantes = await Promise.all(
        invitados.map(async (invitado) => {
          const acompanantes = await this.acompananteRepository.findByInvitadoId(invitado.getId());
          
          return {
            id: invitado.getId(),
            nombre: invitado.getNombre(),
            telefono: invitado.getTelefono(),
            token: invitado.getTokenValue(),
            estado: invitado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado' | 'confirmado_incompleto',
            mensaje: invitado.getMensaje(),
            fechaConfirmacion: invitado.getFechaConfirmacion()?.toISOString(),
            fechaCreacion: invitado.getFechaCreacion().toISOString(),
            cantidadInvitaciones: invitado.getCantidadInvitaciones(),
            fechaLimiteEdicion: invitado.getFechaLimiteEdicion().toISOString(),
            whatsappEnviado: invitado.getWhatsappEnviado(),
            acompanantes: acompanantes.map(acomp => ({
              id: acomp.getId(),
              nombreCompleto: acomp.getNombreCompleto(),
              telefono: acomp.getTelefono(),
              invitadoId: acomp.getInvitadoId()
            }))
          };
        })
      );
      
      return invitadosConAcompanantes;
    } catch (error) {
      throw new Error(`Error al listar invitados: ${(error as Error).message}`);
    }
  }

  async obtenerEstadisticas(): Promise<EstadisticasDto> {
    try {
      const invitados = await this.invitadoRepository.findAll();
      
      let pendientes = 0;
      let confirmados = 0;
      let confirmadosIncompleto = 0;
      let rechazados = 0;
      let totalPersonas = 0;
      let totalPersonasConfirmadas = 0;
      
      for (const invitado of invitados) {
        const estado = invitado.getEstadoValue();
        const cantidadInvitaciones = invitado.getCantidadInvitaciones();
        totalPersonas += cantidadInvitaciones;
        
        switch (estado) {
          case 'pendiente':
            pendientes++;
            break;
          case 'confirmado':
            confirmados++;
            // Para confirmados completos, contamos todas sus invitaciones
            totalPersonasConfirmadas += cantidadInvitaciones;
            break;
          case 'confirmado_incompleto':
            confirmadosIncompleto++;
            // Para incompletos, contamos 1 (titular) + acompañantes registrados
            const acompanantes = await this.acompananteRepository.findByInvitadoId(invitado.getId());
            totalPersonasConfirmadas += 1 + acompanantes.length;
            break;
          case 'rechazado':
            rechazados++;
            break;
        }
      }
      
      const total = invitados.length;
      const porcentajeConfirmacion = totalPersonas > 0 
        ? Math.round((totalPersonasConfirmadas / totalPersonas) * 100)
        : 0;

      return {
        pendientes,
        confirmados,
        confirmadosIncompleto,
        rechazados,
        total,
        totalPersonas,
        totalPersonasConfirmadas,
        porcentajeConfirmacion
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${(error as Error).message}`);
    }
  }
}
