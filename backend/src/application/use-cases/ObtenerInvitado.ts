import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { Token } from '../../domain/value-objects/Token';
import { ConfirmacionEvento } from '../../domain/entities/ConfirmacionEvento';
import { InvitadoConEventoDto } from '../dtos/InvitadoResponseDto';

export class ObtenerInvitado {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(tokenValue: string): Promise<InvitadoConEventoDto | null> {
    try {
      const token = Token.fromString(tokenValue);
      const invitado = await this.invitadoRepository.findByToken(token);
      
      if (!invitado) {
        return null;
      }

      const evento = ConfirmacionEvento.graduacion2024();

      return {
        invitado: {
          id: invitado.getId(),
          nombre: invitado.getNombre(),
          telefono: invitado.getTelefono(),
          token: invitado.getTokenValue(),
          estado: invitado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado',
          mensaje: invitado.getMensaje(),
          fechaConfirmacion: invitado.getFechaConfirmacion()?.toISOString(),
          fechaCreacion: invitado.getFechaCreacion().toISOString()
        },
        evento: {
          titulo: evento.getTitulo(),
          fecha: evento.getFecha().toISOString(),
          fechaFormateada: evento.getFechaFormateada(),
          ubicacion: evento.getUbicacion(),
          duracionAproximada: evento.getDuracionAproximada(),
          codigoVestimenta: evento.getCodigoVestimenta(),
          notaEspecial: evento.getNotaEspecial()
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener invitado: ${(error as Error).message}`);
    }
  }
}