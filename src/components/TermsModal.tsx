import React, { useState, useEffect } from 'react';
import { X, FileText, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LegalDocument {
  id: string;
  document_type: string;
  version: string;
  title: string;
  content: string;
  effective_date: string;
  requires_acceptance: boolean;
}

interface TermsModalProps {
  userId: string;
  onAccept: () => void;
  onDecline?: () => void;
}

export default function TermsModal({ userId, onAccept, onDecline }: TermsModalProps) {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    loadPendingDocuments();
  }, [userId]);

  const loadPendingDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('get_pending_legal_documents', { p_user_id: userId });

      if (error) throw error;

      if (data && data.length > 0) {
        setDocuments(data);
      } else {
        // No hay documentos pendientes
        onAccept();
      }
    } catch (err: any) {
      console.error('Error loading legal documents:', err);
      setError('Error al cargar documentos legales');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCurrent = async () => {
    if (!accepted) {
      setError('Debes aceptar los términos para continuar');
      return;
    }

    const currentDoc = documents[currentDocIndex];

    try {
      setAccepting(true);
      setError(null);

      // Registrar aceptación
      const { error } = await supabase.rpc('accept_legal_document', {
        p_user_id: userId,
        p_document_id: currentDoc.id,
        p_ip_address: null, // El backend puede capturar esto si es necesario
        p_user_agent: navigator.userAgent
      });

      if (error) throw error;

      // Si hay más documentos, mostrar el siguiente
      if (currentDocIndex < documents.length - 1) {
        setCurrentDocIndex(currentDocIndex + 1);
        setAccepted(false);
      } else {
        // Todos los documentos aceptados
        onAccept();
      }
    } catch (err: any) {
      console.error('Error accepting document:', err);
      setError('Error al registrar aceptación');
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    } else {
      // Por defecto, cerrar sesión o no permitir usar la app
      alert('Debes aceptar los términos para usar HUMANBIBLIO');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando documentos legales...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  const currentDoc = documents[currentDocIndex];
  const isLastDocument = currentDocIndex === documents.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentDoc.title}
              </h2>
              <p className="text-sm text-gray-500">
                Versión {currentDoc.version} • Vigente desde {new Date(currentDoc.effective_date).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          {documents.length > 1 && (
            <div className="text-sm text-gray-500">
              Documento {currentDocIndex + 1} de {documents.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <div
              className="text-gray-700 whitespace-pre-wrap"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {currentDoc.content.split('\n').map((paragraph, idx) => {
                // Convertir markdown básico a HTML
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-2xl font-bold mt-6 mb-4 text-gray-900">
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                } else if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-xl font-bold mt-5 mb-3 text-gray-900">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg font-semibold mt-4 mb-2 text-gray-900">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.startsWith('- ')) {
                  return (
                    <li key={idx} className="ml-6 mb-1">
                      {paragraph.replace('- ', '')}
                    </li>
                  );
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <p key={idx} className="font-semibold mb-2">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                } else if (paragraph.trim() === '') {
                  return <div key={idx} className="h-2"></div>;
                } else {
                  return (
                    <p key={idx} className="mb-3">
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Checkbox */}
          <label className="flex items-start space-x-3 mb-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setError(null);
              }}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              He leído y acepto los <strong>{currentDoc.title}</strong>
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDecline}
              disabled={accepting}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50"
            >
              Rechazar
            </button>

            <button
              type="button"
              onClick={handleAcceptCurrent}
              disabled={!accepted || accepting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              {accepting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>{isLastDocument ? 'Aceptar y Continuar' : 'Aceptar y Siguiente'}</span>
                </>
              )}
            </button>
          </div>

          {/* Progress indicator */}
          {documents.length > 1 && (
            <div className="mt-4 flex items-center space-x-2">
              {documents.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    idx < currentDocIndex
                      ? 'bg-green-500'
                      : idx === currentDocIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
