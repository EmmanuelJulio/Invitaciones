#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Infrastructure imports
import { SupabaseClient } from '../src/infrastructure/database/SupabaseClient';
import { InvitadoRepositoryImpl } from '../src/infrastructure/database/InvitadoRepositoryImpl';
import { WhatsAppService } from '../src/infrastructure/external-services/WhatsAppService';
import { TwilioService } from '../src/infrastructure/external-services/TwilioService';

// Use cases
import { CrearInvitacion } from '../src/application/use-cases/CrearInvitacion';

// Domain
import { ConfirmacionEvento } from '../src/domain/entities/ConfirmacionEvento';

interface InvitadoExcel {
  nombre: string;
  telefono: string;
  mensaje?: string;
}

class EnviarInvitaciones {
  private readonly crearInvitacion: CrearInvitacion;
  private readonly whatsAppService: WhatsAppService;
  private readonly twilioService: TwilioService;
  private readonly frontendUrl: string;

  constructor() {
    const supabaseClient = new SupabaseClient();
    const invitadoRepository = new InvitadoRepositoryImpl(supabaseClient);
    
    this.crearInvitacion = new CrearInvitacion(invitadoRepository);
    this.whatsAppService = new WhatsAppService();
    this.twilioService = new TwilioService();
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  async ejecutar(archivoExcel: string): Promise<void> {
    console.log('🚀 Iniciando proceso de envío de invitaciones...');
    
    try {
      // 1. Leer archivo Excel
      console.log(`📖 Leyendo archivo: ${archivoExcel}`);
      const invitados = this.leerArchivoExcel(archivoExcel);
      console.log(`📋 Se encontraron ${invitados.length} invitados`);

      // 2. Crear invitaciones en la base de datos
      console.log('💾 Creando invitaciones en la base de datos...');
      const invitadosCreados = await this.crearInvitacion.crearEnLote(invitados);
      console.log(`✅ Se crearon ${invitadosCreados.length} invitaciones`);

      // 3. Enviar mensajes
      console.log('📱 Enviando mensajes...');
      const evento = ConfirmacionEvento.graduacion2024();
      
      for (const invitado of invitadosCreados) {
        const exito = await this.enviarMensaje(invitado, evento);
        
        if (exito) {
          console.log(`✅ Mensaje enviado a ${invitado.nombre} (${invitado.telefono})`);
        } else {
          console.log(`❌ Error enviando mensaje a ${invitado.nombre} (${invitado.telefono})`);
        }
        
        // Esperar un poco entre mensajes para evitar rate limiting
        await this.esperar(2000);
      }

      console.log('🎉 Proceso completado exitosamente');
      
      // 4. Mostrar resumen
      this.mostrarResumen(invitadosCreados);
      
    } catch (error) {
      console.error('❌ Error durante el proceso:', error);
      process.exit(1);
    }
  }

  private leerArchivoExcel(rutaArchivo: string): InvitadoExcel[] {
    if (!fs.existsSync(rutaArchivo)) {
      throw new Error(`El archivo ${rutaArchivo} no existe`);
    }

    const workbook = XLSX.readFile(rutaArchivo);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data.map((row: any) => {
      const nombre = row['nombre'] || row['Nombre'] || row['NOMBRE'];
      const telefono = row['telefono'] || row['Telefono'] || row['TELEFONO'] || row['teléfono'];
      const mensaje = row['mensaje'] || row['Mensaje'] || row['MENSAJE'];
      
      if (!nombre || !telefono) {
        throw new Error(`Fila inválida: ${JSON.stringify(row)}. Se requiere nombre y teléfono`);
      }
      
      return {
        nombre: String(nombre).trim(),
        telefono: String(telefono).trim(),
        mensaje: mensaje ? String(mensaje).trim() : undefined,
      };
    });
  }

  private async enviarMensaje(
    invitado: { nombre: string; telefono: string; token: string },
    evento: ConfirmacionEvento
  ): Promise<boolean> {
    const urlConfirmacion = `${this.frontendUrl}/confirmar/${invitado.token}`;
    
    const mensajeData = {
      nombre: invitado.nombre,
      urlConfirmacion,
      evento: {
        titulo: evento.getTitulo(),
        fecha: evento.getFechaFormateada(),
        ubicacion: evento.getUbicacion(),
      },
    };

    // Intentar WhatsApp primero
    const mensajeWhatsApp = this.whatsAppService.generateInvitationMessage(mensajeData);
    const exitoWhatsApp = await this.whatsAppService.sendWhatsAppMessage(
      invitado.telefono,
      mensajeWhatsApp
    );

    if (exitoWhatsApp) {
      return true;
    }

    // Si WhatsApp falla, intentar SMS como backup
    console.log(`⚠️  WhatsApp falló para ${invitado.nombre}, intentando SMS...`);
    const mensajeSMS = this.twilioService.generateInvitationMessage(mensajeData);
    const exitoSMS = await this.twilioService.sendSMS(invitado.telefono, mensajeSMS);

    return exitoSMS;
  }

  private async esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private mostrarResumen(invitados: any[]): void {
    console.log('\n📊 RESUMEN:');
    console.log('=' * 50);
    console.log(`Total de invitados: ${invitados.length}`);
    console.log(`URL del panel admin: ${this.frontendUrl}/admin`);
    console.log(`Contraseña admin: ${process.env.ADMIN_PASSWORD}`);
    console.log('\n🔗 URLs de ejemplo:');
    
    invitados.slice(0, 3).forEach((inv, index) => {
      console.log(`${index + 1}. ${inv.nombre}: ${this.frontendUrl}/confirmar/${inv.token}`);
    });
    
    if (invitados.length > 3) {
      console.log(`... y ${invitados.length - 3} más`);
    }
    
    console.log('=' * 50);
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📝 Uso: npm run enviar-invitaciones <archivo.xlsx>

Ejemplo:
  npm run enviar-invitaciones invitados.xlsx

El archivo Excel debe tener las siguientes columnas:
- nombre (requerido)
- telefono (requerido) 
- mensaje (opcional)

Configuración requerida en .env:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- WHATSAPP_TOKEN (opcional)
- TWILIO_ACCOUNT_SID (opcional, backup)
- FRONTEND_URL
    `);
    process.exit(1);
  }

  const archivoExcel = path.resolve(args[0]);
  const script = new EnviarInvitaciones();
  
  await script.ejecutar(archivoExcel);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}