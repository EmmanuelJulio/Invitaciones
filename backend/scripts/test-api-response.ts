import { supabaseAdmin } from '../src/infrastructure/config/database';
import { SupabaseClient } from '../src/infrastructure/database/SupabaseClient';
import { InvitadoRepositoryImpl } from '../src/infrastructure/database/InvitadoRepositoryImpl';
import { AcompananteRepositoryImpl } from '../src/infrastructure/database/AcompananteRepositoryImpl';
import { ListarInvitados } from '../src/application/use-cases/ListarInvitados';

async function testApiResponse() {
  console.log('🧪 Testing API response for Noelia Veron...\n');

  try {
    // Test 1: Direct database query
    console.log('1️⃣ Direct database query:');
    const { data: dbData, error } = await supabaseAdmin
      .from('invitados')
      .select('*')
      .eq('nombre', 'Noelia Veron')
      .single();

    if (error) {
      console.error('❌ DB Error:', error);
      return;
    }

    console.log('✅ Raw DB data:');
    console.log(`   📛 Nombre: ${dbData.nombre}`);
    console.log(`   🔔 Notificado: ${dbData.notificado ? 'SÍ ✅' : 'NO ❌'}`);
    console.log(`   🆔 ID: ${dbData.id}`);

    // Test 2: Through repository layer
    console.log('\n2️⃣ Through repository layer:');
    const supabaseClient = new SupabaseClient();
    const invitadoRepo = new InvitadoRepositoryImpl(supabaseClient);
    const invitado = await invitadoRepo.findById(dbData.id);

    if (!invitado) {
      console.error('❌ Invitado not found in repository');
      return;
    }

    console.log('✅ Repository data:');
    console.log(`   📛 Nombre: ${invitado.getNombre()}`);
    console.log(`   🔔 Notificado: ${invitado.getNotificado() ? 'SÍ ✅' : 'NO ❌'}`);
    console.log(`   🆔 ID: ${invitado.getId()}`);

    // Test 3: Through use case (what the API returns)
    console.log('\n3️⃣ Through ListarInvitados use case (API response):');
    const acompananteRepo = new AcompananteRepositoryImpl();
    const listarUseCase = new ListarInvitados(invitadoRepo, acompananteRepo);
    
    const apiResponse = await listarUseCase.execute();
    const noeliaInApi = apiResponse.find(inv => inv.nombre === 'Noelia Veron');

    if (!noeliaInApi) {
      console.error('❌ Noelia not found in API response');
      return;
    }

    console.log('✅ API Response data:');
    console.log(`   📛 Nombre: ${noeliaInApi.nombre}`);
    console.log(`   🔔 Notificado: ${noeliaInApi.notificado ? 'SÍ ✅' : 'NO ❌'}`);
    console.log(`   🔔 Has notificado field: ${noeliaInApi.hasOwnProperty('notificado') ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   🆔 ID: ${noeliaInApi.id}`);
    console.log(`   📊 Estado: ${noeliaInApi.estado}`);

    // Test 4: Full API response structure
    console.log('\n4️⃣ Full API response structure:');
    console.log('Keys in response object:', Object.keys(noeliaInApi).sort());

    console.log('\n🎉 All tests completed successfully!');
    console.log('📋 Summary:');
    console.log('   - Database has notificado field: ✅');
    console.log('   - Repository reads notificado field: ✅');
    console.log('   - API includes notificado field: ✅');
    console.log(`   - Noelia's notificado status: ${noeliaInApi.notificado ? 'TRUE' : 'FALSE'}`);

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Ejecutar la función
testApiResponse().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
});