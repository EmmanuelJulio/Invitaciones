import { Router } from 'express';
import { InvitadoController } from '../controllers/InvitadoController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

export function createInvitadoRoutes(invitadoController: InvitadoController): Router {
  const router = Router();

  // Rutas públicas (para confirmación)
  router.get('/:token', invitadoController.obtenerPorToken.bind(invitadoController));
  router.post('/:token/confirmar', invitadoController.confirmar.bind(invitadoController));
  router.post('/:token/rechazar', invitadoController.rechazar.bind(invitadoController));

  // Rutas administrativas (requieren autenticación)
  router.get('/', 
    authMiddleware, 
    adminMiddleware, 
    invitadoController.listar.bind(invitadoController)
  );
  
  router.get('/admin/estadisticas', 
    authMiddleware, 
    adminMiddleware, 
    invitadoController.obtenerEstadisticas.bind(invitadoController)
  );
  
  router.post('/', 
    authMiddleware, 
    adminMiddleware, 
    invitadoController.crear.bind(invitadoController)
  );
  
  router.post('/lote', 
    authMiddleware, 
    adminMiddleware, 
    invitadoController.crearEnLote.bind(invitadoController)
  );

  // Nuevas rutas de administración
  router.delete('/admin/todos', 
    authMiddleware, 
    adminMiddleware, 
    invitadoController.eliminarTodos.bind(invitadoController)
  );

  router.delete('/:id', 
    authMiddleware, 
    adminMiddleware, 
    invitadoController.eliminar.bind(invitadoController)
  );

  router.put('/:id', 
    authMiddleware, 
    adminMiddleware, 
    invitadoController.actualizar.bind(invitadoController)
  );

  return router;
}