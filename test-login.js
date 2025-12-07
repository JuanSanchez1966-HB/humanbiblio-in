import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('🔍 Probando login...\n');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'juandejsagan@gmail.com',
      password: 'test123456' // Ajusta la contraseña
    });

    if (error) {
      console.error('❌ ERROR DETALLADO:');
      console.error('  Message:', error.message);
      console.error('  Status:', error.status);
      console.error('  Code:', error.code);
      console.error('  Name:', error.name);
      console.error('\n  Error completo:', JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log('✅ Login exitoso!');
    console.log('  Usuario:', data.user?.email);
    console.log('  Email confirmado:', data.user?.email_confirmed_at);
    console.log('  Session válida:', !!data.session);
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    process.exit(1);
  }
}

testLogin();
