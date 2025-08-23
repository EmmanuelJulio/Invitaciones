import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/login', authController.login.bind(authController));
  router.get('/validate', authController.validateToken.bind(authController));

  return router;
}