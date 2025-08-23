import { NotificationService, MensajeInvitacion } from '../../application/ports/NotificationService';

export class TwilioService implements NotificationService {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendWhatsAppMessage(telefono: string, mensaje: string): Promise<boolean> {
    // Twilio doesn't handle WhatsApp in this implementation
    return false;
  }

  async sendSMS(telefono: string, mensaje: string): Promise<boolean> {
    try {
      if (!this.accountSid || !this.authToken || !this.fromNumber) {
        console.warn('Twilio credentials not configured, skipping SMS send');
        return false;
      }

      const cleanPhone = this.cleanPhoneNumber(telefono);
      
      const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: cleanPhone,
          Body: mensaje
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Twilio API error:', error);
        return false;
      }

      console.log(`SMS sent successfully to ${cleanPhone}`);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  generateInvitationMessage(data: MensajeInvitacion): string {
    return `Hola ${data.nombre}! Te invitamos a ${data.evento.titulo} el ${data.evento.fecha} en ${data.evento.ubicacion}. Confirma tu asistencia: ${data.urlConfirmacion}`;
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