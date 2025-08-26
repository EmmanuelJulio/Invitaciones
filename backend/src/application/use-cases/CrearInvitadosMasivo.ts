import { Invitado } from '../../domain/entities/Invitado';
import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { InvitadoResponseDto } from '../dtos/InvitadoResponseDto';
import { v4 as uuidv4 } from 'uuid';

export interface InvitadoExcelDto {
  id?: string;
  nombre: string;
  telefono?: string;
  mensaje?: string;
  cantidadInvitaciones: number;
}

export interface CrearInvitadosMasivoResponse {
  success: boolean;
  data?: {
    guardados: number;
    invitados: InvitadoResponseDto[];
  };
  error?: string;
}

export class CrearInvitadosMasivo {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(invitadosData: InvitadoExcelDto[]): Promise<CrearInvitadosMasivoResponse> {
    try {
      const invitadosGuardados: InvitadoResponseDto[] = [];

      for (const data of invitadosData) {
        try {
          // Crear la entidad Invitado
          const invitado = Invitado.create(
            data.id || uuidv4(),
            data.nombre,
            data.telefono,
            data.cantidadInvitaciones || 1,
            data.mensaje
          );

          // Guardar en la base de datos
          const invitadoGuardado = await this.invitadoRepository.save(invitado);

          // Convertir a DTO
          const dto: InvitadoResponseDto = {
            id: invitadoGuardado.getId(),
            nombre: invitadoGuardado.getNombre(),
            telefono: invitadoGuardado.getTelefono(),
            token: invitadoGuardado.getTokenValue(),
            estado: invitadoGuardado.getEstadoValue() as any,
            mensaje: invitadoGuardado.getMensaje(),
            fechaConfirmacion: invitadoGuardado.getFechaConfirmacion()?.toISOString(),
            fechaCreacion: invitadoGuardado.getFechaCreacion().toISOString(),
            cantidadInvitaciones: invitadoGuardado.getCantidadInvitaciones(),
            fechaLimiteEdicion: invitadoGuardado.getFechaLimiteEdicion().toISOString(),
            whatsappEnviado: invitadoGuardado.getWhatsappEnviado(),
            acompanantes: [] // Los acompañantes se crean después en la confirmación
          };

          invitadosGuardados.push(dto);
        } catch (error) {
          console.error(`Error guardando invitado ${data.nombre}:`, error);
          // Continuamos con el siguiente invitado en caso de error
        }
      }

      return {
        success: true,
        data: {
          guardados: invitadosGuardados.length,
          invitados: invitadosGuardados
        }
      };

    } catch (error) {
      console.error('Error en creación masiva de invitados:', error);
      return {
        success: false,
        error: 'Error interno guardando los invitados'
      };
    }
  }
}