import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Leer .env manualmente
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function registerTestUser() {
  console.log('🔄 Registrando usuario de prueba...\n');

  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'test123456',
    options: {
      data: {
        name: 'Test User'
      }
    }
  });

  if (error) {
    console.error('❌ Error al registrar:', error.message);
    process.exit(1);
  }

  console.log('✅ Usuario registrado exitosamente!');
  console.log('📧 Email:', data.user?.email);
  console.log('🆔 ID:', data.user?.id);
  console.log('✉️  Email confirmado:', data.user?.email_confirmed_at ? 'Sí' : 'No (auto-confirmación activa)');

  console.log('\n🎉 Ahora puedes usar las credenciales:');
  console.log('   Email: test@example.com');
  console.log('   Password: test123456');
}

registerTestUser();
