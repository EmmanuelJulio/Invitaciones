import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { password } = req.body;
      
      if (!password) {
        res.status(400).json({ error: 'Contraseña es requerida' });
        return;
      }

      const adminPassword = process.env.ADMIN_PASSWORD;
      const jwtSecret = process.env.JWT_SECRET;
      
      if (!adminPassword || !jwtSecret) {
        res.status(500).json({ error: 'Error de configuración del servidor' });
        return;
      }

      // Simple password comparison (in production, use hashed passwords)
      const isValidPassword = password === adminPassword;
      
      if (!isValidPassword) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { isAdmin: true },
        jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        expiresIn: 86400, // 24 hours in seconds
        user: {
          isAdmin: true
        }
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({ error: 'Error de configuración del servidor' });
        return;
      }

      const decoded = jwt.verify(token, jwtSecret) as { isAdmin: boolean };
      
      res.json({
        valid: true,
        user: {
          isAdmin: decoded.isAdmin
        }
      });
    } catch (error) {
      res.status(401).json({ 
        valid: false,
        error: 'Token inválido o expirado' 
      });
    }
  }
}