import React from 'react';

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSystem({ isOpen, onClose }: NotificationSystemProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      type: 'message',
      title: 'Nuevo mensaje',
      content: 'Ana García te ha enviado un mensaje',
      time: 'Hace 5 min',
      unread: true
    },
    {
      id: '2',
      type: 'connection',
      title: 'Nueva conexión',
      content: 'Carlos Rodríguez quiere conectar contigo',
      time: 'Hace 1 hora',
      unread: true
    },
    {
      id: '3',
      type: 'system',
      title: 'Bienvenido a HUMANBIBLIO',
      content: 'Completa tu perfil para obtener mejores conexiones',
      time: 'Hace 2 horas',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">🔔 Notificaciones</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-96">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                notification.unread ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.unread ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium">
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </div>
  );
}