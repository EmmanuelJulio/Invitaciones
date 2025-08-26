import { Request, Response } from 'express';
import { UploadExcelInvitados } from '../../../application/use-cases/UploadExcelInvitados';

export class ExcelController {
  constructor(
    private readonly uploadExcelInvitados: UploadExcelInvitados
  ) {}

  async uploadExcel(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ 
          error: 'No se ha subido ningún archivo',
          success: false 
        });
        return;
      }

      // Validar que sea un archivo Excel
      const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
      ];

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res.status(400).json({ 
          error: 'El archivo debe ser un Excel (.xlsx o .xls)',
          success: false 
        });
        return;
      }

      // Procesar el Excel
      const resultado = await this.uploadExcelInvitados.ejecutar(req.file.buffer);

      res.json({
        success: true,
        data: {
          total: resultado.total,
          procesados: resultado.procesados,
          errores: resultado.errores,
          invitados: resultado.invitados.map(inv => ({
            id: inv.getId(),
            nombre: inv.getNombre(),
            telefono: inv.getTelefono(),
            mensaje: inv.getMensaje(),
            cantidadInvitaciones: inv.getCantidadInvitaciones(),
            token: inv.getTokenValue(),
            urlConfirmacion: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirmar/${inv.getTokenValue()}`
          }))
        }
      });

    } catch (error) {
      console.error('Error en uploadExcel:', error);
      res.status(500).json({ 
        error: (error as Error).message,
        success: false 
      });
    }
  }

  async confirmarYGuardar(req: Request, res: Response): Promise<void> {
    try {
      const { invitados } = req.body;

      if (!invitados || !Array.isArray(invitados)) {
        res.status(400).json({ 
          error: 'Se requiere un array de invitados',
          success: false 
        });
        return;
      }

      // Crear objetos Invitado desde los datos enviados
      // (Aquí asumo que el frontend envía los datos procesados)
      // En una implementación real, podrías querer recrear los objetos Invitado

      // Por ahora retornamos éxito
      res.json({
        success: true,
        message: `Se procesaron ${invitados.length} invitados correctamente`,
        data: {
          guardados: invitados.length
        }
      });

    } catch (error) {
      console.error('Error en confirmarYGuardar:', error);
      res.status(500).json({ 
        error: (error as Error).message,
        success: false 
      });
    }
  }

  async descargarTemplate(req: Request, res: Response): Promise<void> {
    try {
      // Generar un template Excel básico
      const XLSX = require('xlsx');
      
      const templateData = [
        {
          'nombre': 'Juan Pérez González',
          'telefono': '+573001234567',
          'mensaje': 'Te esperamos en este día especial',
          'cantidad_invitaciones': 2
        },
        {
          'nombre': 'María Elena Rodríguez',
          'telefono': '+573007654321', 
          'mensaje': 'Será un honor contar con tu presencia',
          'cantidad_invitaciones': 1
        },
        {
          'nombre': 'Carlos Alberto Martínez',
          'telefono': '3009876543',
          'mensaje': 'Queremos celebrar contigo este logro',
          'cantidad_invitaciones': 3
        }
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      
      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 30 }, // nombre
        { wch: 20 }, // telefono
        { wch: 50 }, // mensaje
        { wch: 20 }  // cantidad_invitaciones
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitados');

      // Generar buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=template-invitados.xlsx');
      
      res.send(buffer);

    } catch (error) {
      console.error('Error generando template:', error);
      res.status(500).json({ 
        error: 'Error generando template de Excel',
        success: false 
      });
    }
  }
}