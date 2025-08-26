import { supabaseAdmin } from '../src/infrastructure/config/database';

async function corregirEstadosIndividuales() {
  console.log('🔧 Iniciando corrección de estados de invitaciones individuales...');
  
  try {
    
    // Buscar invitaciones individuales marcadas como incompletas
    const { data: invitaciones, error } = await supabaseAdmin
      .from('invitados')
      .select('*')
      .eq('estado', 'confirmado_incompleto')
      .eq('cantidad_invitaciones', 1);
    
    if (error) {
      throw error;
    }
    
    if (!invitaciones || invitaciones.length === 0) {
      console.log('✅ No se encontraron invitaciones individuales con estado incorrecto.');
      return;
    }
    
    console.log(`📋 Encontradas ${invitaciones.length} invitaciones individuales a corregir:`);
    
    for (const inv of invitaciones) {
      console.log(`  - ${inv.nombre}: ${inv.estado} → confirmado`);
      
      // Actualizar directamente en la base de datos
      const { error: updateError } = await supabaseAdmin
        .from('invitados')
        .update({
          estado: 'confirmado'
        })
        .eq('id', inv.id);
      
      if (updateError) {
        console.error(`❌ Error actualizando ${inv.nombre}:`, updateError);
      } else {
        console.log(`✅ Corregido: ${inv.nombre}`);
      }
    }
    
    console.log('🎉 Corrección completada!');
    
  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Ejecutar el script
corregirEstadosIndividuales();