import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 VERIFICANDO CONFIGURACIÓN NETLIFY...');
console.log('==========================================');
console.log('URL:', supabaseUrl ? `✅ Configurada: ${supabaseUrl}` : '🌟 Faltante - MODO DEMO LIBERTAD ACTIVADO');
console.log('Key:', supabaseAnonKey ? `✅ Configurada: ${supabaseAnonKey.substring(0, 20)}...` : '🌟 Faltante - MODO DEMO LIBERTAD ACTIVADO');
console.log('==========================================');

// Verificar si estamos en modo demo
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

// Cliente mock ultra-robusto para demo
const createDemoClient = () => {
  console.log('🌟 HUMANBIBLIO - MODO DEMO LIBERTAD ACTIVADO');
  console.log('==========================================');
  console.log('🎯 Estado: Comunicación libre completamente funcional');
  console.log('👥 Usuarios: 5 perfiles mock con fotos');
  console.log('🏢 Negocios: 4 negocios mock con galerías');
  console.log('🧠 IA: 4 personalidades contextuales');
  console.log('📱 PWA: Instalable como app nativa');
  console.log('🌍 Geo: Geolocalización funcional');
  console.log('💬 Chat: Respuestas inteligentes');
  console.log('🎤 Voz: Grabación real');
  console.log('📞 Llamadas: Interfaces profesionales');
  console.log('==========================================');
  
  return {
    auth: {
      getSession: () => {
        console.log('🎭 Demo: getSession llamado');
        return Promise.resolve({ data: { session: null }, error: null });
      },
      getUser: () => {
        console.log('🎭 Demo: getUser llamado');
        return Promise.resolve({ data: { user: null }, error: null });
      },
      signInWithPassword: (credentials: any) => {
        console.log('🎭 Demo: signInWithPassword llamado con:', credentials.email);
        return Promise.resolve({
          data: null,
          error: { message: '🎭 Modo Demo - Para autenticación real, configura Supabase' }
        });
      },
      signUp: (credentials: any) => {
        console.log('🎭 Demo: signUp llamado con:', credentials.email);
        return Promise.resolve({
          data: null,
          error: { message: '🎭 Modo Demo - Para registro real, configura Supabase' }
        });
      },
      signOut: () => {
        console.log('🎭 Demo: signOut llamado');
        return Promise.resolve({ error: null });
      },
      onAuthStateChange: (callback: any) => {
        console.log('🎭 Demo: onAuthStateChange configurado');
        return {
          data: {
            subscription: {
              unsubscribe: () => console.log('🎭 Demo: Auth listener desconectado')
            }
          },
          error: null
        };
      }
    },
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: () => {
            console.log(`🎭 Mock: SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`);
            return Promise.resolve({ 
              data: null, 
              error: { code: 'DEMO_MODE', message: 'Tabla no existe en modo demo' } 
            });
          }
        }),
        limit: (count: number) => {
          console.log(`🎭 Mock: SELECT ${columns} FROM ${table} LIMIT ${count}`);
          return Promise.resolve({ 
            data: [], 
            error: { code: 'DEMO_MODE', message: 'Tabla no existe en modo demo' } 
          });
        }
      }),
      insert: (data: any) => {
        console.log(`🎭 Mock: INSERT INTO ${table}:`, data);
        return Promise.resolve({ 
          data: null, 
          error: { message: '🎭 Modo Demo - Para persistencia real, configura Supabase' } 
        });
      },
      update: (data: any) => {
        console.log(`🎭 Mock: UPDATE ${table}:`, data);
        return Promise.resolve({ 
          data: null, 
          error: { message: '🎭 Modo Demo - Para persistencia real, configura Supabase' } 
        });
      }
    })
  };
};

// Crear cliente con manejo de errores críticos para Netlify
let supabaseClient;

if (isDemoMode) {
  console.log('🎭 INICIANDO EN MODO DEMO');
  console.log('💡 Para modo producción, configura:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - VITE_SUPABASE_ANON_KEY');
  supabaseClient = createDemoClient();
} else {
  try {
    console.log('🔗 CREANDO CLIENTE SUPABASE REAL...');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'implicit' // Más simple que PKCE, mejor para web
      },
      global: {
        fetch: (url, options = {}) => {
          // Añadir headers adicionales para debugging
          const headers = {
            ...options.headers,
          };
          console.log(`🌐 Fetch request to: ${url}`);
          return fetch(url, { ...options, headers });
        }
      }
    });
    console.log('✅ Cliente Supabase creado exitosamente');
    console.log('🔒 Configuración simplificada aplicada');
    console.log('🚀 Listo para migración');
    
  } catch (error) {
    console.error('❌ Error creando cliente Supabase:', error);
    console.log('🔄 Fallback a modo demo seguro');
    supabaseClient = createDemoClient();
  }
}

export const supabase = supabaseClient;

// Flag para saber si estamos en modo demo
export const isProductionReady = !!supabaseUrl && !!supabaseAnonKey;

if (isDemoMode) {
  console.log('🎭 HUMANBIBLIO ejecutándose en MODO DEMO');
  console.log('📊 Datos: Mock users + Mock businesses');
  console.log('💬 Chat: IA simulada funcionando');
  console.log('📸 Fotos: URLs de Pexels');
  console.log('🎬 Media: Galerías simuladas');
} else {
  console.log('🚀 HUMANBIBLIO ejecutándose en MODO PRODUCCIÓN');
  console.log('🔗 Conectado a:', supabaseUrl);
  console.log('🗄️ Listo para migración de base de datos');
}

console.log('==========================================');