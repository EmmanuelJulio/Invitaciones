import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { CrearInvitadosMasivo, InvitadoExcelDto } from '../../../application/use-cases/CrearInvitadosMasivo';

interface InvitadoExcel {
  id?: string;
  nombre: string;
  telefono?: string;
  mensaje?: string;
  cantidadInvitaciones: number;
  token?: string;
  urlConfirmacion?: string;
}

interface UploadExcelResponse {
  success: boolean;
  data?: {
    total: number;
    procesados: number;
    errores: string[];
    invitados: InvitadoExcel[];
  };
  error?: string;
}

interface ConfirmarGuardarResponse {
  success: boolean;
  message?: string;
  data?: {
    guardados: number;
  };
  error?: string;
}

// Configuración de multer para archivos en memoria
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
    }
  },
});

export class ExcelUploadController {
  constructor(private readonly crearInvitadosMasivo: CrearInvitadosMasivo) {}

  async uploadExcel(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No se ha enviado ningún archivo'
        });
      }

      const buffer = req.file.buffer;
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      // Obtener la primera hoja
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        return res.status(400).json({
          success: false,
          error: 'El archivo Excel está vacío'
        });
      }

      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

      if (rawData.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No se encontraron datos en el archivo Excel'
        });
      }

      const invitados: InvitadoExcel[] = [];
      const errores: string[] = [];
      let procesados = 0;

      rawData.forEach((row: any, index: number) => {
        try {
          const rowNumber = index + 2; // +2 porque Excel empieza en 1 y saltamos header

          // Mapear columnas (permitir variaciones en nombres)
          const nombre = this.getColumnValue(row, ['Nombre Completo', 'Nombre', 'nombre', 'nombre_completo']);
          const telefono = this.getColumnValue(row, ['Teléfono (Opcional)', 'Teléfono', 'Telefono', 'telefono', 'phone']);
          const cantidad = this.getColumnValue(row, ['Cantidad Invitaciones', 'Cantidad', 'cantidad_invitaciones', 'invitaciones']);
          const mensaje = this.getColumnValue(row, ['Mensaje (Opcional)', 'Mensaje', 'mensaje', 'message']);

          // Validaciones
          if (!nombre || nombre.trim() === '') {
            errores.push(`Fila ${rowNumber}: El nombre es obligatorio`);
            return;
          }

          // Limpiar y validar teléfono (opcional)
          let telefonoLimpio = undefined;
          if (telefono && telefono.toString().trim() !== '') {
            telefonoLimpio = telefono.toString().replace(/\s+/g, ' ').trim();
            if (telefonoLimpio.length < 10) {
              errores.push(`Fila ${rowNumber}: El teléfono debe tener al menos 10 caracteres o estar vacío`);
              return;
            }
          }

          // Validar cantidad
          let cantidadNum = 1;
          if (cantidad) {
            cantidadNum = parseInt(cantidad.toString());
            if (isNaN(cantidadNum) || cantidadNum < 1 || cantidadNum > 10) {
              errores.push(`Fila ${rowNumber}: La cantidad debe ser un número entre 1 y 10`);
              return;
            }
          }

          // Si llegamos aquí, el registro es válido
          const invitado: InvitadoExcel = {
            id: uuidv4(),
            nombre: nombre.trim(),
            telefono: telefonoLimpio,
            cantidadInvitaciones: cantidadNum,
            mensaje: mensaje ? mensaje.toString().trim() : undefined,
          };

          invitados.push(invitado);
          procesados++;

        } catch (error) {
          errores.push(`Fila ${index + 2}: Error procesando datos - ${error}`);
        }
      });

      const response: UploadExcelResponse = {
        success: true,
        data: {
          total: rawData.length,
          procesados,
          errores,
          invitados
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Error procesando archivo Excel:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno procesando el archivo Excel'
      });
    }
  }

  async confirmarYGuardar(req: Request, res: Response) {
    try {
      const { invitados }: { invitados: InvitadoExcel[] } = req.body;

      if (!invitados || !Array.isArray(invitados) || invitados.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No se han enviado invitados para guardar'
        });
      }

      console.log(`Guardando ${invitados.length} invitados en la base de datos...`);
      
      // Convertir a DTO del use case
      const invitadosData: InvitadoExcelDto[] = invitados.map(inv => ({
        id: inv.id,
        nombre: inv.nombre,
        telefono: inv.telefono,
        mensaje: inv.mensaje,
        cantidadInvitaciones: inv.cantidadInvitaciones
      }));

      // Usar el use case para guardar
      const resultado = await this.crearInvitadosMasivo.execute(invitadosData);

      if (resultado.success) {
        const response: ConfirmarGuardarResponse = {
          success: true,
          message: `Se guardaron ${resultado.data?.guardados || 0} invitados correctamente`,
          data: {
            guardados: resultado.data?.guardados || 0
          }
        };
        res.json(response);
      } else {
        res.status(500).json({
          success: false,
          error: resultado.error || 'Error guardando invitados'
        });
      }

    } catch (error) {
      console.error('Error guardando invitados:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno guardando los invitados'
      });
    }
  }

  private getColumnValue(row: any, possibleNames: string[]): any {
    for (const name of possibleNames) {
      if (row[name] !== undefined && row[name] !== null) {
        return row[name];
      }
    }
    return undefined;
  }
}