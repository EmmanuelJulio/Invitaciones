import { Router } from 'express';
import { ExcelTemplateController } from '../controllers/ExcelTemplateController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const excelTemplateController = new ExcelTemplateController();

// GET /api/excel/template - Descargar template de Excel
router.get('/template', authMiddleware, (req, res) => 
  excelTemplateController.descargarTemplate(req, res)
);

export { router as excelTemplateRoutes };