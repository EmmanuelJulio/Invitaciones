import { Request, Response } from 'express';
import * as XLSX from 'xlsx';

export class ExcelTemplateController {
  async descargarTemplate(req: Request, res: Response) {
    try {
      // Crear un workbook con datos de ejemplo
      const workbook = XLSX.utils.book_new();
      
      // Datos de ejemplo para el template
      const datosEjemplo = [
        {
          'Nombre Completo': 'Juan Pérez García',
          'Teléfono (Opcional)': '+54 11 1234 5678', 
          'Cantidad Invitaciones': 2,
          'Mensaje (Opcional)': 'Familia García - Mesa principal'
        },
        {
          'Nombre Completo': 'María López Ruiz',
          'Teléfono (Opcional)': '',
          'Cantidad Invitaciones': 1,
          'Mensaje (Opcional)': 'Sin WhatsApp - contactar por email'
        },
        {
          'Nombre Completo': 'Carlos Mendoza Silva',
          'Teléfono (Opcional)': '+54 11 9876 5432',
          'Cantidad Invitaciones': 4,
          'Mensaje (Opcional)': 'Familia completa - Necesitan silla para bebé'
        }
      ];

      // Crear la hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(datosEjemplo);
      
      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 25 }, // Nombre Completo
        { wch: 18 }, // Teléfono
        { wch: 20 }, // Cantidad Invitaciones
        { wch: 35 }  // Mensaje
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitados');

      // Agregar una hoja de instrucciones
      const instrucciones = [
        {
          'Instrucciones para usar este template:': ''
        },
        {
          'Instrucciones para usar este template:': '1. Complete la información en la hoja "Invitados"'
        },
        {
          'Instrucciones para usar este template:': '2. Nombre Completo: Obligatorio, nombre y apellidos del invitado principal'
        },
        {
          'Instrucciones para usar este template:': '3. Teléfono (Opcional): Número de WhatsApp con código de país (+54) para envío automático'
        },
        {
          'Instrucciones para usar este template:': '4. Cantidad Invitaciones: Número de personas que puede traer (incluyéndose)'
        },
        {
          'Instrucciones para usar este template:': '5. Mensaje (Opcional): Notas adicionales, mesa asignada, etc.'
        },
        {
          'Instrucciones para usar este template:': ''
        },
        {
          'Instrucciones para usar este template:': 'IMPORTANTE:'
        },
        {
          'Instrucciones para usar este template:': '- No modifique los nombres de las columnas'
        },
        {
          'Instrucciones para usar este template:': '- Elimine las filas de ejemplo antes de subir su archivo'
        },
        {
          'Instrucciones para usar este template:': '- El teléfono es opcional, pero si se incluye debe tener código de país (+54 para Argentina)'
        },
        {
          'Instrucciones para usar este template:': '- La cantidad mínima de invitaciones es 1, máxima es 10'
        }
      ];

      const worksheetInstrucciones = XLSX.utils.json_to_sheet(instrucciones);
      worksheetInstrucciones['!cols'] = [{ wch: 70 }];
      XLSX.utils.book_append_sheet(workbook, worksheetInstrucciones, 'Instrucciones');

      // Generar el buffer del archivo Excel
      const buffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx' 
      });

      // Configurar headers para descarga
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template-invitados.xlsx"',
        'Content-Length': buffer.length
      });

      // Enviar el archivo
      res.send(buffer);
      
    } catch (error) {
      console.error('Error generando template Excel:', error);
      res.status(500).json({
        success: false,
        error: 'Error generando el template de Excel'
      });
    }
  }
}