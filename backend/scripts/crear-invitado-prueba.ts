#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import { SupabaseClient } from '../src/infrastructure/database/SupabaseClient';
import { InvitadoRepositoryImpl } from '../src/infrastructure/database/InvitadoRepositoryImpl';
import { CrearInvitacion } from '../src/application/use-cases/CrearInvitacion';

// Load environment variables
dotenv.config();

class CrearInvitadoPrueba {
  private readonly crearInvitacion: CrearInvitacion;
  private readonly frontendUrl: string;

  constructor() {
    const supabaseClient = new SupabaseClient();
    const invitadoRepository = new InvitadoRepositoryImpl(supabaseClient);
    
    this.crearInvitacion = new CrearInvitacion(invitadoRepository);
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  async ejecutar(nombre: string, telefono: string, mensaje: string = ''): Promise<void> {
    console.log('🎯 Creando invitado de prueba...');
    
    try {
      const invitado = await this.crearInvitacion.ejecutar({
        nombre,
        telefono,
        mensaje: mensaje || `¡Hola ${nombre}! Te invitamos a nuestro evento especial.`
      });

      const urlConfirmacion = `${this.frontendUrl}/confirmar/${invitado.token}`;
      
      console.log('✅ Invitado creado exitosamente!');
      console.log('━'.repeat(60));
      console.log(`📛 Nombre: ${invitado.nombre}`);
      console.log(`📱 Teléfono: ${invitado.telefono}`);  
      console.log(`🎫 Token: ${invitado.token}`);
      console.log(`🔗 URL: ${urlConfirmacion}`);
      console.log('━'.repeat(60));
      console.log('');
      console.log('🎯 Para probar la confirmación:');
      console.log(`   1. Abre: ${urlConfirmacion}`);
      console.log(`   2. Confirma o rechaza asistencia`);
      console.log(`   3. Ve al panel admin para ver el cambio de estado`);
      console.log('');

    } catch (error) {
      console.error('❌ Error creando invitado:', error);
      process.exit(1);
    }
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
📝 Uso: npm run crear-invitado-prueba "Nombre Completo" "Teléfono" ["Mensaje opcional"]

Ejemplos:
  npm run crear-invitado-prueba "Juan Pérez" "+573001234567"
  npm run crear-invitado-prueba "María González" "+573007654321" "Esperamos verte!"
  npm run crear-invitado-prueba "Test Usuario" "+573009999999"
    `);
    process.exit(1);
  }

  const [nombre, telefono, mensaje] = args;
  const script = new CrearInvitadoPrueba();
  
  await script.ejecutar(nombre, telefono, mensaje);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}