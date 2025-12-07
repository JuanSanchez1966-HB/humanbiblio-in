import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function DiagnosticPanel() {
  const [connectionTest, setConnectionTest] = useState<'testing' | 'success' | 'error'>('testing');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const [renderCount, setRenderCount] = useState(0);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Contador de renders para confirmar que el componente se está renderizando
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('🎨 DiagnosticPanel renderizado:', renderCount + 1);
  }, []);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing Supabase connection...');
        const { data, error } = await supabase.from('profiles').select('count').limit(1);

        if (error) {
          console.error('❌ Connection test failed:', error);
          setConnectionTest('error');
          setErrorDetails(error.message);
        } else {
          console.log('✅ Connection test successful');
          setConnectionTest('success');
        }
      } catch (err: any) {
        console.error('❌ Connection test exception:', err);
        setConnectionTest('error');
        setErrorDetails(err.message || 'Unknown error');
      }
    };

    if (supabaseUrl && supabaseKey) {
      testConnection();
    }

    // Interceptar logs de autenticación
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('Login') || message.includes('Auth') || message.includes('signIn')) {
        setAuthLogs(prev => [...prev, `LOG: ${message.substring(0, 100)}`].slice(-5));
      }
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('Login') || message.includes('Auth') || message.includes('signIn')) {
        setAuthLogs(prev => [...prev, `ERROR: ${message.substring(0, 100)}`].slice(-5));
      }
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, [supabaseUrl, supabaseKey]);

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-4 border-red-600 rounded-lg p-6 shadow-2xl z-[9999] max-w-md max-h-[80vh] overflow-y-auto">
      <div className="mb-3">
        <h3 className="font-bold text-xl flex items-center gap-2 text-red-600">
          <AlertCircle className="w-6 h-6" />
          PANEL DEBUG v{renderCount}
        </h3>
        <p className="text-xs text-gray-600 mt-1">Este panel NO se puede cerrar - para debugging</p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          {supabaseUrl ? (
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold">VITE_SUPABASE_URL:</p>
            <p className="break-all text-gray-600 text-xs">
              {supabaseUrl || '❌ NO CONFIGURADA'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          {supabaseKey ? (
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold">VITE_SUPABASE_ANON_KEY:</p>
            <p className="break-all text-gray-600 text-xs">
              {supabaseKey ? `${supabaseKey.substring(0, 30)}...` : '❌ NO CONFIGURADA'}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="font-semibold mb-1">Conexión a Supabase:</p>
          {connectionTest === 'testing' && (
            <p className="text-yellow-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Probando conexión...
            </p>
          )}
          {connectionTest === 'success' && (
            <p className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Conexión exitosa
            </p>
          )}
          {connectionTest === 'error' && (
            <div>
              <p className="text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Error de conexión
              </p>
              <p className="text-xs text-red-500 mt-1">{errorDetails}</p>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="font-semibold mb-1">Logs de Autenticación:</p>
          {authLogs.length === 0 ? (
            <p className="text-xs text-gray-500">Sin intentos de login todavía...</p>
          ) : (
            <div className="space-y-1">
              {authLogs.map((log, idx) => (
                <p key={idx} className="text-xs text-gray-700 bg-gray-50 p-1 rounded">
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-200 space-y-2">
          <button
            onClick={async () => {
              console.log('🧪 TEST MANUAL - Email: test@test.com, Pass: 123456');
              setAuthLogs(prev => [...prev, 'Iniciando test manual...'].slice(-5));
              const { data, error } = await supabase.auth.signInWithPassword({
                email: 'test@test.com',
                password: '123456'
              });
              if (error) {
                console.error('🔴 ERROR TEST:', error);
                setAuthLogs(prev => [...prev, `ERROR: ${error.message}`].slice(-5));
                alert('ERROR: ' + error.message);
              } else {
                console.log('✅ SUCCESS TEST:', data);
                setAuthLogs(prev => [...prev, 'SUCCESS!'].slice(-5));
                alert('Login exitoso!');
              }
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold"
          >
            PROBAR LOGIN AHORA
          </button>

          <div className="text-xs bg-gray-800 text-green-400 p-2 rounded font-mono">
            Panel renderizado: {renderCount} veces
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-700 font-semibold">
            Presiona F12 para abrir la consola
          </p>
        </div>
      </div>
    </div>
  );
}
