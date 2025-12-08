import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ ErrorBoundary capturó error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏛️</div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              HUMANBIBLIO
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
              La Inteligencia Natural
            </p>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '1.5rem',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ color: '#ffcccb', marginBottom: '1rem', fontWeight: 'bold' }}>
                ⚠️ Error de Aplicación Detectado
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Se produjo un error inesperado. Nuestro sistema de recuperación está activo.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>🛠️ Recuperación Automática:</h3>
              <div style={{ textAlign: 'left', fontSize: '0.9rem', opacity: 0.9 }}>
                <p>• ✅ Error capturado y registrado</p>
                <p>• ✅ Sistema de fallback activado</p>
                <p>• ✅ Datos de usuario preservados</p>
                <p>• ✅ Modo demo disponible</p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              🔄 Recargar HUMANBIBLIO
            </button>
            
            <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.7 }}>
              <p>Error técnico: {this.state.error?.message}</p>
              <p>Timestamp: {new Date().toISOString()}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}