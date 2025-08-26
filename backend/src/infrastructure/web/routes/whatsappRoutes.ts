import { Router } from 'express';
import { WhatsAppController } from '../controllers/WhatsAppController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

export function createWhatsAppRoutes(whatsAppController: WhatsAppController): Router {
  const router = Router();

  // Todas las rutas requieren autenticación admin
  router.use(authMiddleware);
  router.use(adminMiddleware);

  // Enviar WhatsApp a un invitado específico
  router.post('/enviar/:invitadoId', 
    whatsAppController.enviarIndividual.bind(whatsAppController)
  );

  // Enviar WhatsApp masivo a todos los invitados
  router.post('/enviar-masivo', 
    whatsAppController.enviarMasivo.bind(whatsAppController)
  );

  // Reenviar a los que fallaron
  router.post('/reenviar-fallidos', 
    whatsAppController.reenviarFallidos.bind(whatsAppController)
  );

  // Obtener estadísticas de envíos
  router.get('/estadisticas', 
    whatsAppController.obtenerEstadoEnvios.bind(whatsAppController)
  );

  return router;
}