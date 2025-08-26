import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { NotificationService } from '../ports/NotificationService';
import { ConfirmacionEvento } from '../../domain/entities/ConfirmacionEvento';

export interface EnvioWhatsAppResult {
  invitadoId: string;
  nombre: string;
  telefono?: string;
  exitoso: boolean;
  error?: string;
  urlConfirmacion: string;
}

export class EnviarWhatsApp {
  private readonly frontendUrl: string;

  constructor(
    private readonly invitadoRepository: InvitadoRepository,
    private readonly whatsAppService: NotificationService
  ) {
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  async enviarIndividual(invitadoId: string): Promise<EnvioWhatsAppResult> {
    const invitado = await this.invitadoRepository.findById(invitadoId);
    
    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    const telefono = invitado.getTelefono();
    const urlConfirmacion = `${this.frontendUrl}/confirmar/${invitado.getTokenValue()}`;
    
    // Si no hay teléfono, no se puede enviar WhatsApp
    if (!telefono) {
      return {
        invitadoId: invitado.getId(),
        nombre: invitado.getNombre(),
        telefono: undefined,
        exitoso: false,
        error: 'El invitado no tiene número de teléfono registrado',
        urlConfirmacion
      };
    }

    const evento = ConfirmacionEvento.graduacion2024();

    const mensajeData = {
      nombre: invitado.getNombre(),
      urlConfirmacion,
      evento: {
        titulo: evento.getTitulo(),
        fecha: evento.getFechaFormateada(),
        ubicacion: evento.getUbicacion(),
      },
    };

    // Generar mensaje personalizado
    const mensaje = this.generarMensajePersonalizado(mensajeData);

    try {
      const exitoso = await this.whatsAppService.sendWhatsAppMessage(
        telefono,
        mensaje
      );

      if (exitoso) {
        invitado.marcarWhatsappEnviado();
        await this.invitadoRepository.update(invitado);
      } else {
        invitado.incrementarIntentosEnvio();
        await this.invitadoRepository.update(invitado);
      }

      return {
        invitadoId: invitado.getId(),
        nombre: invitado.getNombre(),
        telefono: telefono,
        exitoso,
        error: exitoso ? undefined : 'Error enviando WhatsApp',
        urlConfirmacion
      };

    } catch (error) {
      invitado.incrementarIntentosEnvio();
      await this.invitadoRepository.update(invitado);

      return {
        invitadoId: invitado.getId(),
        nombre: invitado.getNombre(),
        telefono: telefono,
        exitoso: false,
        error: (error as Error).message,
        urlConfirmacion
      };
    }
  }

  async enviarMasivo(): Promise<EnvioWhatsAppResult[]> {
    const invitados = await this.invitadoRepository.findAll();
    const resultados: EnvioWhatsAppResult[] = [];

    for (const invitado of invitados) {
      try {
        const resultado = await this.enviarIndividual(invitado.getId());
        resultados.push(resultado);

        // Pequeña pausa para evitar rate limiting
        await this.esperar(1000);

      } catch (error) {
        resultados.push({
          invitadoId: invitado.getId(),
          nombre: invitado.getNombre(),
          telefono: invitado.getTelefono() || undefined,
          exitoso: false,
          error: (error as Error).message,
          urlConfirmacion: `${this.frontendUrl}/confirmar/${invitado.getTokenValue()}`
        });
      }
    }

    return resultados;
  }

  async reenviarFallidos(): Promise<EnvioWhatsAppResult[]> {
    const invitados = await this.invitadoRepository.findAll();
    const fallidos = invitados.filter(inv => !inv.getWhatsappEnviado());
    
    const resultados: EnvioWhatsAppResult[] = [];

    for (const invitado of fallidos) {
      try {
        const resultado = await this.enviarIndividual(invitado.getId());
        resultados.push(resultado);

        await this.esperar(1000);

      } catch (error) {
        resultados.push({
          invitadoId: invitado.getId(),
          nombre: invitado.getNombre(),
          telefono: invitado.getTelefono() || undefined,
          exitoso: false,
          error: (error as Error).message,
          urlConfirmacion: `${this.frontendUrl}/confirmar/${invitado.getTokenValue()}`
        });
      }
    }

    return resultados;
  }

  private generarMensajePersonalizado(data: any): string {
    return `¡Hola ${data.nombre}! 🎓

Te invitamos cordialmente a nuestra ${data.evento.titulo}.

📅 *Fecha:* ${data.evento.fecha}
📍 *Lugar:* ${data.evento.ubicacion}

Este link te lleva a una página con más información del evento donde podrás confirmar tu asistencia:
${data.urlConfirmacion}

En la página encontrarás todos los detalles importantes del evento, incluyendo el código de vestimenta y notas especiales.

¡Esperamos contar contigo en este día tan especial! ✨`;
  }

  private async esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}