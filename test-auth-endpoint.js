// Test directo del endpoint de Auth de Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer .env manualmente
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Test de Auth Endpoint');
console.log('========================');
console.log('URL:', supabaseUrl);
console.log('Key (primeros 20):', supabaseKey.substring(0, 20) + '...');
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthEndpoint() {
  console.log('1️⃣ Test de conexión básica (listado de tablas)...');
  const startBasic = Date.now();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    const elapsedBasic = Date.now() - startBasic;
    console.log(`   ✅ Conexión básica OK (${elapsedBasic}ms)`);
    if (error && error.code !== 'PGRST116') {
      console.log('   ⚠️ Error:', error.message);
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  console.log('');
  console.log('2️⃣ Test de Auth: Verificar sesión actual...');
  const startSession = Date.now();

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    const elapsedSession = Date.now() - startSession;
    console.log(`   ✅ getSession completado (${elapsedSession}ms)`);
    console.log('   Sesión activa:', session ? 'SI' : 'NO');
    if (error) {
      console.log('   ⚠️ Error:', error.message);
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  console.log('');
  console.log('3️⃣ Test de Auth: Intentar login con credenciales incorrectas...');
  console.log('   (Esperamos un error rápido, no timeout)');
  const startLogin = Date.now();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@nonexistent.com',
      password: 'wrongpassword123'
    });

    const elapsedLogin = Date.now() - startLogin;
    console.log(`   ⏱️ signInWithPassword completado (${elapsedLogin}ms)`);

    if (error) {
      console.log('   ✅ Error esperado recibido:', error.message);
    } else {
      console.log('   ⚠️ Login exitoso (inesperado):', data.user?.email);
    }
  } catch (err) {
    const elapsedLogin = Date.now() - startLogin;
    console.log(`   ⏱️ Exception después de ${elapsedLogin}ms`);
    console.log('   ❌ Error:', err.message);
  }

  console.log('');
  console.log('4️⃣ Test de Auth: Intentar login con usuario del piloto...');
  const startRealLogin = Date.now();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'piloto1@humanbiblio.com',
      password: 'Piloto2024!'
    });

    const elapsedRealLogin = Date.now() - startRealLogin;
    console.log(`   ⏱️ signInWithPassword completado (${elapsedRealLogin}ms)`);

    if (error) {
      console.log('   ⚠️ Error:', error.message);
    } else {
      console.log('   ✅ Login exitoso:', data.user?.email);
    }
  } catch (err) {
    const elapsedRealLogin = Date.now() - startRealLogin;
    console.log(`   ⏱️ Exception después de ${elapsedRealLogin}ms`);
    console.log('   ❌ Error:', err.message);
  }

  console.log('');
  console.log('✅ Test completado');
}

testAuthEndpoint().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
