import React from 'react';
import { AlertCircle, XCircle, Info, CheckCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function ErrorMessage({
  type = 'error',
  title,
  message,
  onClose,
  action
}: ErrorMessageProps) {
  const styles = {
    error: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      button: 'bg-red-600 hover:bg-red-700 text-white',
      defaultTitle: 'Error'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      defaultTitle: 'Advertencia'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      defaultTitle: 'Información'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-900',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      button: 'bg-green-600 hover:bg-green-700 text-white',
      defaultTitle: 'Éxito'
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`rounded-xl border-2 p-4 ${currentStyle.container} relative`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {currentStyle.icon}
        </div>

        <div className="flex-1 min-w-0">
          {(title || currentStyle.defaultTitle) && (
            <h4 className="font-semibold mb-1">
              {title || currentStyle.defaultTitle}
            </h4>
          )}
          <p className="text-sm leading-relaxed">{message}</p>

          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStyle.button}`}
            >
              {action.label}
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
