/*
  # Auto-confirmar usuarios al registrarse
  
  1. Función
    - Trigger que confirma automáticamente el email de nuevos usuarios
    - Se ejecuta después de crear un usuario en auth.users
  
  2. Seguridad
    - Solo se ejecuta en nuevos registros
    - Actualiza email_confirmed_at automáticamente
*/

-- Crear función que confirma usuarios automáticamente
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Confirmar email automáticamente si no está confirmado
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at = NOW();
    NEW.confirmation_token = '';
    NEW.confirmation_sent_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger para auto-confirmar usuarios
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- Confirmar TODOS los usuarios existentes que no están confirmados
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmation_token = '',
  confirmation_sent_at = NULL
WHERE email_confirmed_at IS NULL;
