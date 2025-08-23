import { NotificationService, MensajeInvitacion } from '../../application/ports/NotificationService';

export class WhatsAppService implements NotificationService {
  private readonly token: string;
  private readonly phoneNumberId: string;
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.token = process.env.WHATSAPP_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  async sendWhatsAppMessage(telefono: string, mensaje: string): Promise<boolean> {
    try {
      if (!this.token || !this.phoneNumberId) {
        console.warn('WhatsApp credentials not configured, skipping message send');
        return false;
      }

      const cleanPhone = this.cleanPhoneNumber(telefono);
      
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: {
            body: mensaje
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return false;
      }

      console.log(`WhatsApp message sent successfully to ${cleanPhone}`);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendSMS(telefono: string, mensaje: string): Promise<boolean> {
    // WhatsApp service doesn't handle SMS, delegate to TwilioService
    return false;
  }

  generateInvitationMessage(data: MensajeInvitacion): string {
    return `¡Hola ${data.nombre}! 🎓

Te invitamos cordialmente a nuestra ${data.evento.titulo}.

📅 *Fecha:* ${data.evento.fecha}
📍 *Lugar:* ${data.evento.ubicacion}

Para confirmar tu asistencia, por favor ingresa al siguiente enlace:
${data.urlConfirmacion}

En la página encontrarás todos los detalles importantes del evento, incluyendo el código de vestimenta y notas especiales.

¡Esperamos contar contigo en este día tan especial! ✨`;
  }

  private cleanPhoneNumber(telefono: string): string {
    // Remove all non-numeric characters except +
    let cleaned = telefono.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add country code (assuming Colombia +57)
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('57')) {
        cleaned = '+' + cleaned;
      } else {
        cleaned = '+57' + cleaned;
      }
    }
    
    return cleaned;
  }
}