import { apiClient } from '../../../api/client';
import type {
  InvitadoResponseDto,
  EstadisticasDto,
  CrearInvitadoDto,
} from '../../../shared/types/api';

export class AdminService {
  static async listarInvitados(): Promise<InvitadoResponseDto[]> {
    const response = await apiClient.get<InvitadoResponseDto[]>('/invitados');
    return response.data;
  }

  static async obtenerEstadisticas(): Promise<EstadisticasDto> {
    const response = await apiClient.get<EstadisticasDto>('/invitados/admin/estadisticas');
    return response.data;
  }

  static async crearInvitado(dto: CrearInvitadoDto): Promise<InvitadoResponseDto> {
    const response = await apiClient.post<InvitadoResponseDto>('/invitados', dto);
    return response.data;
  }

  static async crearInvitadosEnLote(invitados: CrearInvitadoDto[]): Promise<InvitadoResponseDto[]> {
    const response = await apiClient.post<InvitadoResponseDto[]>('/invitados/lote', {
      invitados,
    });
    return response.data;
  }

  static exportarCSV(invitados: InvitadoResponseDto[]): void {
    const headers = [
      'Nombre',
      'Teléfono',
      'Estado',
      'Mensaje',
      'Fecha Confirmación',
      'Fecha Creación',
      'Token'
    ];

    const csvContent = [
      headers.join(','),
      ...invitados.map(inv => [
        `"${inv.nombre}"`,
        `"${inv.telefono}"`,
        inv.estado,
        `"${inv.mensaje || ''}"`,
        inv.fechaConfirmacion || '',
        new Date(inv.fechaCreacion).toLocaleDateString(),
        inv.token
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `invitados_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}