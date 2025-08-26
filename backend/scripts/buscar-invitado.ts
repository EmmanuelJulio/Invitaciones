import { supabaseAdmin } from '../src/infrastructure/config/database';

async function buscarInvitado() {
  try {
    console.log('🔍 Buscando a Noelia Veron en la base de datos...');
    
    // Buscar por nombre (case insensitive)
    const { data: invitados, error } = await supabaseAdmin
      .from('invitados')
      .select('*')
      .ilike('nombre', '%noelia%veron%')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al buscar:', error);
      return;
    }

    if (!invitados || invitados.length === 0) {
      console.log('❌ No se encontró a Noelia Veron');
      
      // Buscar solo por "Noelia"
      console.log('🔍 Buscando solo por "Noelia"...');
      const { data: noelias, error: error2 } = await supabaseAdmin
        .from('invitados')
        .select('*')
        .ilike('nombre', '%noelia%')
        .order('created_at', { ascending: false });

      if (error2) {
        console.error('❌ Error al buscar Noelia:', error2);
        return;
      }

      if (noelias && noelias.length > 0) {
        console.log('✅ Invitados con "Noelia" encontrados:', noelias.length);
        noelias.forEach((invitado, index) => {
          console.log(`\n👤 Invitado ${index + 1}:`);
          console.log(`  📛 Nombre: ${invitado.nombre}`);
          console.log(`  📞 Teléfono: ${invitado.telefono || 'Sin teléfono'}`);
          console.log(`  🆔 ID: ${invitado.id}`);
          console.log(`  📧 Token: ${invitado.token}`);
          console.log(`  📊 Estado: ${invitado.estado}`);
          console.log(`  📅 Creado: ${new Date(invitado.created_at).toLocaleString()}`);
          
          // Verificar si existe el campo notificado
          if (invitado.hasOwnProperty('notificado')) {
            console.log(`  🔔 Notificado: ${invitado.notificado ? 'SÍ ✅' : 'NO ❌'}`);
          } else {
            console.log(`  🚨 Campo 'notificado' NO EXISTE en la base de datos`);
          }
        });
      } else {
        console.log('❌ No se encontró ningún invitado con "Noelia"');
      }
      return;
    }

    console.log('✅ Invitados encontrados:', invitados.length);
    
    invitados.forEach((invitado, index) => {
      console.log(`\n👤 Invitado ${index + 1}:`);
      console.log(`  📛 Nombre: ${invitado.nombre}`);
      console.log(`  📞 Teléfono: ${invitado.telefono || 'Sin teléfono'}`);
      console.log(`  🆔 ID: ${invitado.id}`);
      console.log(`  📧 Token: ${invitado.token}`);
      console.log(`  📊 Estado: ${invitado.estado}`);
      console.log(`  📅 Creado: ${new Date(invitado.created_at).toLocaleString()}`);
      
      // Verificar si existe el campo notificado
      if (invitado.hasOwnProperty('notificado')) {
        console.log(`  🔔 Notificado: ${invitado.notificado ? 'SÍ ✅' : 'NO ❌'}`);
      } else {
        console.log(`  🚨 Campo 'notificado' NO EXISTE en la base de datos`);
      }
    });

    // Intentar actualizar el campo notificado del primer resultado
    if (invitados.length > 0) {
      const primerInvitado = invitados[0];
      console.log(`\n🔄 Intentando actualizar campo 'notificado' para: ${primerInvitado.nombre}`);
      
      try {
        const { data: actualizado, error: errorUpdate } = await supabaseAdmin
          .from('invitados')
          .update({ notificado: true })
          .eq('id', primerInvitado.id)
          .select()
          .single();

        if (errorUpdate) {
          console.error('❌ Error al actualizar notificado:', errorUpdate.message);
          if (errorUpdate.message.includes('column') && errorUpdate.message.includes('notificado')) {
            console.log('\n🚨 DIAGNÓSTICO: La columna "notificado" NO EXISTE en la tabla "invitados"');
            console.log('\n📋 SOLUCIÓN: Ejecuta este comando SQL en Supabase:');
            console.log('ALTER TABLE invitados ADD COLUMN notificado BOOLEAN DEFAULT FALSE;');
          }
        } else {
          console.log('✅ Campo notificado actualizado exitosamente');
          console.log('📄 Resultado:', actualizado);
        }
      } catch (updateError) {
        console.error('❌ Error en la actualización:', updateError);
      }
    }

  } catch (err) {
    console.error('💥 Error general:', err);
  }
}

// Ejecutar la función
buscarInvitado().then(() => {
  console.log('\n🏁 Búsqueda completada');
  process.exit(0);
});