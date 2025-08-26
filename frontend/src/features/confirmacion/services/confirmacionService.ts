import { apiClient } from '../../../api/client';
import type {
  InvitadoConEventoDto,
  ConfirmarAsistenciaDto,
  InvitadoResponseDto,
} from '../../../shared/types/api';

export class ConfirmacionService {
  static async obtenerInvitado(token: string): Promise<InvitadoConEventoDto | null> {
    try {
      const response = await apiClient.get<InvitadoConEventoDto>(`/invitados/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo invitado:', error);
      return null;
    }
  }

  static async confirmarAsistencia(
    dto: ConfirmarAsistenciaDto
  ): Promise<InvitadoResponseDto> {
    const response = await apiClient.post<InvitadoResponseDto>(
      `/invitados/${dto.token}/confirmar`,
      {
        confirmado: dto.confirmado,
        mensaje: dto.mensaje,
      }
    );
    return response.data;
  }

  static async rechazarAsistencia(
    token: string,
    mensaje?: string
  ): Promise<InvitadoResponseDto> {
    const response = await apiClient.post<InvitadoResponseDto>(
      `/invitados/${token}/rechazar`,
      {
        mensaje,
      }
    );
    return response.data;
  }
}