import * as XLSX from 'xlsx';
import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { Invitado } from '../../domain/entities/Invitado';
import { v4 as uuidv4 } from 'uuid';

export interface InvitadoExcelData {
  nombre: string;
  telefono: string;
  mensaje?: string;
  cantidad_invitaciones?: number;
}

export interface UploadExcelResult {
  invitados: Invitado[];
  errores: string[];
  total: number;
  procesados: number;
}

export class UploadExcelInvitados {
  constructor(
    private readonly invitadoRepository: InvitadoRepository
  ) {}

  async ejecutar(bufferExcel: Buffer): Promise<UploadExcelResult> {
    const errores: string[] = [];
    const invitados: Invitado[] = [];

    try {
      // Leer el archivo Excel
      const workbook = XLSX.read(bufferExcel, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      
      if (!sheetName) {
        throw new Error('El archivo Excel no contiene hojas de cálculo');
      }

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        throw new Error('El archivo Excel está vacío');
      }

      // Procesar cada fila
      for (let i = 0; i < data.length; i++) {
        const fila = data[i] as any;
        const numeroFila = i + 2; // +2 porque Excel empieza en 1 y la fila 1 son headers

        try {
          const invitadoData = this.validarYNormalizarFila(fila, numeroFila);
          
          const invitado = Invitado.create(
            uuidv4(),
            invitadoData.nombre,
            invitadoData.telefono,
            invitadoData.cantidad_invitaciones || 1,
            invitadoData.mensaje
          );

          invitados.push(invitado);
        } catch (error) {
          errores.push(`Fila ${numeroFila}: ${(error as Error).message}`);
        }
      }

      return {
        invitados,
        errores,
        total: data.length,
        procesados: invitados.length
      };

    } catch (error) {
      throw new Error(`Error procesando Excel: ${(error as Error).message}`);
    }
  }

  async guardarInvitados(invitados: Invitado[]): Promise<Invitado[]> {
    const invitadosGuardados: Invitado[] = [];

    for (const invitado of invitados) {
      try {
        const guardado = await this.invitadoRepository.save(invitado);
        invitadosGuardados.push(guardado);
      } catch (error) {
        console.error(`Error guardando invitado ${invitado.getNombre()}:`, error);
        // Continúa con el siguiente invitado
      }
    }

    return invitadosGuardados;
  }

  private validarYNormalizarFila(fila: any, numeroFila: number): InvitadoExcelData {
    // Buscar el campo nombre (flexible con diferentes variaciones)
    const nombre = this.extraerCampo(fila, ['nombre', 'Nombre', 'NOMBRE', 'name', 'Name']);
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El campo "nombre" es requerido');
    }

    // Buscar el campo telefono
    const telefono = this.extraerCampo(fila, ['telefono', 'Telefono', 'TELEFONO', 'teléfono', 'phone']);
    if (!telefono || telefono.trim().length === 0) {
      throw new Error('El campo "telefono" es requerido');
    }

    // Buscar mensaje (opcional)
    const mensaje = this.extraerCampo(fila, ['mensaje', 'Mensaje', 'MENSAJE', 'message']);

    // Buscar cantidad de invitaciones
    const cantidadInvitaciones = this.extraerCampo(fila, [
      'cantidad_invitaciones', 
      'cantidad_entradas',
      'invitaciones', 
      'entradas',
      'Cantidad de entradas',
      'CANTIDAD_INVITACIONES'
    ]);

    // Validar y normalizar cantidad de invitaciones
    let cantidadNormalizada = 1;
    if (cantidadInvitaciones) {
      const numero = parseInt(cantidadInvitaciones.toString());
      if (isNaN(numero) || numero < 1 || numero > 10) {
        throw new Error('La cantidad de invitaciones debe ser un número entre 1 y 10');
      }
      cantidadNormalizada = numero;
    }

    return {
      nombre: nombre.trim(),
      telefono: this.normalizarTelefono(telefono.trim()),
      mensaje: mensaje?.trim(),
      cantidad_invitaciones: cantidadNormalizada
    };
  }

  private extraerCampo(fila: any, posiblesNombres: string[]): string | undefined {
    for (const nombre of posiblesNombres) {
      if (fila[nombre] !== undefined && fila[nombre] !== null) {
        return String(fila[nombre]);
      }
    }
    return undefined;
  }

  private normalizarTelefono(telefono: string): string {
    // Remover caracteres no numéricos excepto +
    let limpio = telefono.replace(/[^\d+]/g, '');
    
    // Si no empieza con +, agregar código de país (Colombia +57)
    if (!limpio.startsWith('+')) {
      if (limpio.startsWith('57')) {
        limpio = '+' + limpio;
      } else {
        limpio = '+57' + limpio;
      }
    }
    
    return limpio;
  }
}