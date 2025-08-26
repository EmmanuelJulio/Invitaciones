import { Router } from 'express';
import multer from 'multer';
import { ExcelController } from '../controllers/ExcelController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

// Configurar multer para manejar uploads de archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx o .xls)'));
    }
  }
});

export function createExcelRoutes(excelController: ExcelController): Router {
  const router = Router();

  // Todas las rutas requieren autenticación admin
  router.use(authMiddleware);
  router.use(adminMiddleware);

  // Descargar template de Excel
  router.get('/template', 
    excelController.descargarTemplate.bind(excelController)
  );

  // Subir y procesar Excel (vista previa)
  router.post('/upload', 
    upload.single('excel'),
    excelController.uploadExcel.bind(excelController)
  );

  // Confirmar y guardar los invitados procesados
  router.post('/confirmar', 
    excelController.confirmarYGuardar.bind(excelController)
  );

  return router;
}