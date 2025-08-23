export interface NotificationService {
  sendWhatsAppMessage(telefono: string, mensaje: string): Promise<boolean>;
  sendSMS(telefono: string, mensaje: string): Promise<boolean>;
}

export interface MensajeInvitacion {
  nombre: string;
  urlConfirmacion: string;
  evento: {
    titulo: string;
    fecha: string;
    ubicacion: string;
  };
}