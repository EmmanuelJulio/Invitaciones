import { apiClient } from '../../../api/client';
import type { InvitadoExcel } from '../types/excel';

interface UploadExcelResponse {
  success: boolean;
  data?: {
    total: number;
    procesados: number;
    errores: string[];
    invitados: InvitadoExcel[];
  };
  error?: string;
}

interface ConfirmarGuardarResponse {
  success: boolean;
  message?: string;
  data?: {
    guardados: number;
  };
  error?: string;
}

class ExcelService {
  async uploadExcel(archivo: File): Promise<UploadExcelResponse> {
    const formData = new FormData();
    formData.append('excel', archivo);

    const response = await apiClient.post('/excel/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async confirmarYGuardar(invitados: InvitadoExcel[]): Promise<ConfirmarGuardarResponse> {
    const response = await apiClient.post('/excel/confirmar', {
      invitados
    });

    return response.data;
  }

  async descargarTemplate(): Promise<void> {
    const response = await apiClient.get('/excel/template', {
      responseType: 'blob'
    });

    // Crear URL del blob y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template-invitados.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const excelService = new ExcelService();