import { supabaseAdmin } from '../src/infrastructure/config/database';
import { SupabaseClient } from '../src/infrastructure/database/SupabaseClient';
import { InvitadoRepositoryImpl } from '../src/infrastructure/database/InvitadoRepositoryImpl';
import { AcompananteRepositoryImpl } from '../src/infrastructure/database/AcompananteRepositoryImpl';

async function revisarJoseBravo() {
  console.log('🔍 Revisando a José Bravo...\n');

  try {
    // Buscar José Bravo en la base de datos
    const { data: dbData, error } = await supabaseAdmin
      .from('invitados')
      .select('*')
      .ilike('nombre', '%jose%bravo%')
      .single();

    if (error) {
      console.error('❌ Error buscando José Bravo:', error);
      return;
    }

    if (!dbData) {
      console.log('❌ José Bravo no encontrado');
      return;
    }

    console.log('👤 José Bravo encontrado:');
    console.log(`   📛 Nombre: ${dbData.nombre}`);
    console.log(`   🆔 ID: ${dbData.id}`);
    console.log(`   📊 Estado actual: ${dbData.estado}`);
    console.log(`   🎫 Cantidad permitida: ${dbData.cantidad_invitaciones}`);
    console.log(`   📅 Fecha confirmación: ${dbData.fecha_confirmacion ? new Date(dbData.fecha_confirmacion).toLocaleString() : 'N/A'}`);

    // Buscar acompañantes
    const { data: acompanantes, error: errorAcomp } = await supabaseAdmin
      .from('acompanantes')
      .select('*')
      .eq('invitado_id', dbData.id);

    if (errorAcomp) {
      console.error('❌ Error buscando acompañantes:', errorAcomp);
      return;
    }

    console.log(`\n👥 Acompañantes registrados: ${acompanantes?.length || 0}`);
    if (acompanantes && acompanantes.length > 0) {
      acompanantes.forEach((acomp, index) => {
        console.log(`   ${index + 1}. ${acomp.nombre_completo} - ${acomp.telefono || 'Sin teléfono'}`);
      });
    }

    // Calcular personas confirmadas
    const personasConfirmadas = 1 + (acompanantes?.length || 0); // 1 titular + acompañantes
    const invitacionesPermitidas = dbData.cantidad_invitaciones;

    console.log(`\n📊 Análisis:`);
    console.log(`   👥 Personas confirmadas: ${personasConfirmadas} (1 titular + ${acompanantes?.length || 0} acompañantes)`);
    console.log(`   🎫 Invitaciones permitidas: ${invitacionesPermitidas}`);
    console.log(`   ✅ ¿Debería estar completo?: ${personasConfirmadas >= invitacionesPermitidas ? 'SÍ' : 'NO'}`);

    // Si debería estar completo pero no lo está, corregir
    if (personasConfirmadas >= invitacionesPermitidas && dbData.estado === 'confirmado_incompleto') {
      console.log(`\n🔧 CORRECCIÓN NECESARIA: José Bravo debería estar "confirmado" pero está "confirmado_incompleto"`);
      
      // Actualizar estado directamente en la base de datos
      console.log('⚡ Actualizando estado a "confirmado"...');
      const { error: updateError } = await supabaseAdmin
        .from('invitados')
        .update({ estado: 'confirmado' })
        .eq('id', dbData.id);

      if (updateError) {
        console.error('❌ Error actualizando estado:', updateError);
      } else {
        console.log('✅ Estado actualizado correctamente a "confirmado"');
      }
    } else if (dbData.estado === 'confirmado') {
      console.log('\n✅ José Bravo ya está en estado "confirmado" - Todo correcto');
    } else {
      console.log(`\n⚠️  José Bravo está en estado "${dbData.estado}" - Esto es esperado`);
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Ejecutar la función
revisarJoseBravo().then(() => {
  console.log('\n🏁 Revisión completada');
  process.exit(0);
});