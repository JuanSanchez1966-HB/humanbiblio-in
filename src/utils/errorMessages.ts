export const friendlyErrorMessages: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos. Por favor verifica tus datos.',
  'User already registered': 'Este email ya está registrado. ¿Quieres iniciar sesión?',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Unable to validate email address: invalid format': 'El formato del email no es válido.',
  'Signup requires a valid password': 'Debes ingresar una contraseña válida.',
  'Network request failed': 'Error de conexión. Verifica tu internet e intenta nuevamente.',
  'Failed to fetch': 'No se pudo conectar al servidor. Verifica tu conexión.',
  'Fetch failed': 'Error de conexión. Por favor intenta nuevamente.',

  'auth/user-not-found': 'No existe una cuenta con este email.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/email-already-in-use': 'Este email ya está en uso.',
  'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El email ingresado no es válido.',
  'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',

  'storage/unauthorized': 'No tienes permisos para subir archivos.',
  'storage/quota-exceeded': 'Has excedido el límite de almacenamiento.',
  'storage/unauthenticated': 'Debes iniciar sesión para subir archivos.',
  'storage/object-not-found': 'El archivo no fue encontrado.',
  'storage/invalid-format': 'El formato del archivo no es válido.',

  '42P01': 'Error de base de datos: tabla no encontrada.',
  '23505': 'Este registro ya existe.',
  '23503': 'No se puede completar la operación debido a restricciones de datos.',
  '22P02': 'El formato de los datos no es válido.',

  default: 'Ocurrió un error inesperado. Por favor intenta nuevamente.'
};

export function getErrorMessage(error: any): string {
  if (!error) return friendlyErrorMessages.default;

  const errorMessage = error?.message || error?.error_description || error?.toString() || '';
  const errorCode = error?.code || error?.status?.toString() || '';

  if (friendlyErrorMessages[errorMessage]) {
    return friendlyErrorMessages[errorMessage];
  }

  if (friendlyErrorMessages[errorCode]) {
    return friendlyErrorMessages[errorCode];
  }

  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return friendlyErrorMessages['Network request failed'];
  }

  if (errorMessage.includes('password')) {
    return 'Error relacionado con la contraseña. Por favor verifica e intenta nuevamente.';
  }

  if (errorMessage.includes('email')) {
    return 'Error relacionado con el email. Por favor verifica el formato.';
  }

  if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
    return 'No tienes permisos para realizar esta acción.';
  }

  if (errorMessage) {
    return errorMessage;
  }

  return friendlyErrorMessages.default;
}

export function getErrorType(error: any): 'error' | 'warning' | 'info' {
  const errorMessage = error?.message || error?.toString() || '';
  const errorCode = error?.code || '';

  if (errorCode === '23505' || errorMessage.includes('already')) {
    return 'warning';
  }

  if (errorMessage.includes('confirm') || errorMessage.includes('verify')) {
    return 'info';
  }

  return 'error';
}
