import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Infrastructure
import { SupabaseClient } from './infrastructure/database/SupabaseClient';
import { InvitadoRepositoryImpl } from './infrastructure/database/InvitadoRepositoryImpl';

// Use Cases
import { ObtenerInvitado } from './application/use-cases/ObtenerInvitado';
import { ConfirmarAsistencia } from './application/use-cases/ConfirmarAsistencia';
import { ListarInvitados } from './application/use-cases/ListarInvitados';
import { CrearInvitacion } from './application/use-cases/CrearInvitacion';

// Controllers
import { InvitadoController } from './infrastructure/web/controllers/InvitadoController';
import { AuthController } from './infrastructure/web/controllers/AuthController';

// Routes
import { createInvitadoRoutes } from './infrastructure/web/routes/invitadoRoutes';
import { createAuthRoutes } from './infrastructure/web/routes/authRoutes';

// Middlewares
import { errorHandler, notFoundHandler } from './infrastructure/web/middlewares/errorHandler';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001');
    
    this.setupMiddlewares();
    this.setupDependencies();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddlewares(): void {
    // Security
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }));
    
    // Logging
    this.app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private setupDependencies(): void {
    // Database
    const supabaseClient = new SupabaseClient();
    const invitadoRepository = new InvitadoRepositoryImpl(supabaseClient);

    // Use Cases
    const obtenerInvitado = new ObtenerInvitado(invitadoRepository);
    const confirmarAsistencia = new ConfirmarAsistencia(invitadoRepository);
    const listarInvitados = new ListarInvitados(invitadoRepository);
    const crearInvitacion = new CrearInvitacion(invitadoRepository);

    // Controllers
    const invitadoController = new InvitadoController(
      obtenerInvitado,
      confirmarAsistencia,
      listarInvitados,
      crearInvitacion
    );
    const authController = new AuthController();

    // Store controllers for route setup
    (this as any).invitadoController = invitadoController;
    (this as any).authController = authController;
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // API Routes
    this.app.use('/api/auth', createAuthRoutes((this as any).authController));
    this.app.use('/api/invitados', createInvitadoRoutes((this as any).invitadoController));

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'API de Invitaciones de Graduación',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          auth: '/api/auth',
          invitados: '/api/invitados'
        }
      });
    });
  }

  private setupErrorHandlers(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
    });
  }
}

// Start the application
const app = new App();
app.start();