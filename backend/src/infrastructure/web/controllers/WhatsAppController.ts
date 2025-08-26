import { Request, Response } from 'express';
import { EnviarWhatsApp } from '../../../application/use-cases/EnviarWhatsApp';

export class WhatsAppController {
  constructor(
    private readonly enviarWhatsApp: EnviarWhatsApp
  ) {}

  async enviarIndividual(req: Request, res: Response): Promise<void> {
    try {
      const { invitadoId } = req.params;

      if (!invitadoId) {
        res.status(400).json({ 
          error: 'ID del invitado es requerido',
          success: false 
        });
        return;
      }

      const resultado = await this.enviarWhatsApp.enviarIndividual(invitadoId);

      res.json({
        success: resultado.exitoso,
        data: resultado
      });

    } catch (error) {
      console.error('Error enviando WhatsApp individual:', error);
      res.status(500).json({ 
        error: (error as Error).message,
        success: false 
      });
    }
  }

  async enviarMasivo(req: Request, res: Response): Promise<void> {
    try {
      const resultados = await this.enviarWhatsApp.enviarMasivo();

      const exitosos = resultados.filter(r => r.exitoso).length;
      const fallidos = resultados.filter(r => !r.exitoso);

      res.json({
        success: true,
        data: {
          total: resultados.length,
          exitosos: exitosos,
          fallidos: fallidos.length,
          resultados: resultados,
          resumen: {
            mensaje: `Se enviaron ${exitosos} de ${resultados.length} mensajes correctamente`,
            errores: fallidos.map(f => `${f.nombre}: ${f.error}`)
          }
        }
      });

    } catch (error) {
      console.error('Error enviando WhatsApp masivo:', error);
      res.status(500).json({ 
        error: (error as Error).message,
        success: false 
      });
    }
  }

  async reenviarFallidos(req: Request, res: Response): Promise<void> {
    try {
      const resultados = await this.enviarWhatsApp.reenviarFallidos();

      const exitosos = resultados.filter(r => r.exitoso).length;

      res.json({
        success: true,
        data: {
          total: resultados.length,
          exitosos: exitosos,
          fallidos: resultados.length - exitosos,
          resultados: resultados,
          mensaje: `Se reenviaron ${exitosos} de ${resultados.length} mensajes correctamente`
        }
      });

    } catch (error) {
      console.error('Error reenviando WhatsApp:', error);
      res.status(500).json({ 
        error: (error as Error).message,
        success: false 
      });
    }
  }

  async obtenerEstadoEnvios(req: Request, res: Response): Promise<void> {
    try {
      // Este endpoint podría mostrar estadísticas de envíos
      // Por ahora retornamos un placeholder
      res.json({
        success: true,
        data: {
          mensaje: 'Endpoint para estadísticas de envíos - por implementar'
        }
      });

    } catch (error) {
      console.error('Error obteniendo estado envíos:', error);
      res.status(500).json({ 
        error: (error as Error).message,
        success: false 
      });
    }
  }
}