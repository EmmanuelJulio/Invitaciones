import React, { useState } from 'react';
import { EventoInfo } from './EventoInfo';
import { FormularioConfirmacion } from './FormularioConfirmacion';

// Datos de ejemplo para mostrar la interfaz
const eventoDemo = {
  titulo: 'Graduación 2024',
  fecha: '2024-12-15T18:00:00',
  fechaFormateada: 'Sábado, 15 de diciembre de 2024 a las 18:00',
  ubicacion: 'Salón de Eventos Plaza Mayor',
  duracionAproximada: 'Aproximadamente 4 horas',
  codigoVestimenta: 'Elegante Sport',
  notaEspecial: 'Por motivo de las elecciones, el servicio de alcohol finalizará a las 12 de la noche.'
};

export const PaginaConfirmacionDemo: React.FC = () => {
  const [estado, setEstado] = useState<'pendiente' | 'confirmado' | 'rechazado'>('pendiente');
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async (mensaje?: string) => {
    console.log('Mensaje:', mensaje);
    setLoading(true);
    // Simular loading
    setTimeout(() => {
      setEstado('confirmado');
      setLoading(false);
    }, 1500);
  };

  const handleRechazar = async (mensaje?: string) => {
    setLoading(true);
    console.log('Mensaje:', mensaje);
    // Simular loading
    setTimeout(() => {
      setEstado('rechazado');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen gradient-bg py-4 sm:py-8">
      <div className="container-responsive">
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          
          {/* Botones para cambiar estado (solo para demo) */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              🎯 Demo - Cambiar Estado de Invitación
            </h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setEstado('pendiente')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  estado === 'pendiente' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                📋 Pendiente
              </button>
              <button 
                onClick={() => setEstado('confirmado')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  estado === 'confirmado' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                ✅ Confirmado
              </button>
              <button 
                onClick={() => setEstado('rechazado')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  estado === 'rechazado' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                ❌ Rechazado
              </button>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              👆 Usa estos botones para ver cómo se ve cada estado de la invitación
            </p>
          </div>

          {/* Información del evento */}
          <EventoInfo evento={eventoDemo} />

          {/* Formulario de confirmación */}
          <FormularioConfirmacion
            nombre="Juan Carlos Pérez"
            estadoActual={estado}
            onConfirmar={handleConfirmar}
            onRechazar={handleRechazar}
            loading={loading}
          />

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 py-4">
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};