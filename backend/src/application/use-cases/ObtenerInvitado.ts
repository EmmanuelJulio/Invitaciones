import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { AcompananteRepository } from '../../domain/repositories/AcompananteRepository';
import { Token } from '../../domain/value-objects/Token';
import { ConfirmacionEvento } from '../../domain/entities/ConfirmacionEvento';
import { InvitadoConEventoDto } from '../dtos/InvitadoResponseDto';

export class ObtenerInvitado {
  constructor(
    private readonly invitadoRepository: InvitadoRepository,
    private readonly acompananteRepository: AcompananteRepository
  ) {}

  async execute(tokenValue: string): Promise<InvitadoConEventoDto | null> {
    try {
      const token = Token.fromString(tokenValue);
      const invitado = await this.invitadoRepository.findByToken(token);
      
      if (!invitado) {
        return null;
      }

      const evento = ConfirmacionEvento.graduacion2024();
      const acompanantes = await this.acompananteRepository.findByInvitadoId(invitado.getId());

      return {
        invitado: {
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