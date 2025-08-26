import { apiClient } from '../../../api/client';

export interface EnvioWhatsAppRequest {
  invitadoId: string;
}

export interface EnvioWhatsAppMasivoRequest {
  invitadosIds?: string[];
}

export interface ResultadoEnvio {
  invitadoId: string;
  exitoso: boolean;
  error?: string;
  fechaEnvio?: string;
}

export interface EnvioWhatsAppResponse {
  success: boolean;
  data?: {
    resultados: ResultadoEnvio[];
    totalEnviados: number;
    totalErrores: number;
  };
  error?: string;
}

class WhatsAppService {
  async enviarIndividual(invitadoId: string): Promise<EnvioWhatsAppResponse> {
    const response = await apiClient.post('/whatsapp/enviar', {
      invitadoId
    });
    
    return response.data;
  }

  async enviarMasivo(invitadosIds?: string[]): Promise<EnvioWhatsAppResponse> {
    const response = await apiClient.post('/whatsapp/enviar-masivo', {
      invitadosIds
    });
    
    return response.data;
  }

  async reenviarFallidos(): Promise<EnvioWhatsAppResponse> {
    const response = await apiClient.post('/whatsapp/reenviar-fallidos');
    
    return response.data;
  }

  async obtenerEstadoEnvios(): Promise<ResultadoEnvio[]> {
    const response = await apiClient.get('/whatsapp/estado-envios');
    
    return response.data.data || [];
  }
}

export const whatsAppService = new WhatsAppService();