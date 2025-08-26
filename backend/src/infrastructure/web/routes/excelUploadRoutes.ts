import { Router } from 'express';
import { ExcelUploadController, uploadMiddleware } from '../controllers/ExcelUploadController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { CrearInvitadosMasivo } from '../../../application/use-cases/CrearInvitadosMasivo';
import { InvitadoRepositoryImpl } from '../../database/InvitadoRepositoryImpl';
import { SupabaseClient } from '../../database/SupabaseClient';

// Crear dependencias
const supabaseClient = new SupabaseClient();
const invitadoRepository = new InvitadoRepositoryImpl(supabaseClient);
const crearInvitadosMasivo = new CrearInvitadosMasivo(invitadoRepository);

const router = Router();
const excelUploadController = new ExcelUploadController(crearInvitadosMasivo);

// POST /api/excel/upload - Upload y procesar archivo Excel
router.post('/upload', 
  authMiddleware, 
  uploadMiddleware.single('excel'), 
  (req, res) => excelUploadController.uploadExcel(req, res)
);

// POST /api/excel/confirmar - Confirmar y guardar invitados procesados
router.post('/confirmar', 
  authMiddleware, 
  (req, res) => excelUploadController.confirmarYGuardar(req, res)
);

export { router as excelUploadRoutes };