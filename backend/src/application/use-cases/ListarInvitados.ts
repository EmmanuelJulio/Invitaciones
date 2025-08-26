import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { InvitadoResponseDto, EstadisticasDto } from '../dtos/InvitadoResponseDto';

export class ListarInvitados {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(): Promise<InvitadoResponseDto[]> {
    try {
      const invitados = await this.invitadoRepository.findAll();
      
      return invitados.map(invitado => ({
        id: invitado.getId(),
        nombre: invitado.getNombre(),
        telefono: invitado.getTelefono(),
        token: invitado.getTokenValue(),
        estado: invitado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado',
        mensaje: invitado.getMensaje(),
        fechaConfirmacion: invitado.getFechaConfirmacion()?.toISOString(),
        fechaCreacion: invitado.getFechaCreacion().toISOString()
      }));
    } catch (error) {
      throw new Error(`Error al listar invitados: ${(error as Error).message}`);
    }
  }

  async obtenerEstadisticas(): Promise<EstadisticasDto> {
    try {
      const stats = await this.invitadoRepository.countByEstado();
      
      const porcentajeConfirmacion = stats.total > 0 
        ? Math.round((stats.confirmados / stats.total) * 100)
        : 0;

      return {
        ...stats,
        porcentajeConfirmacion
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${(error as Error).message}`);
    }
  }
}