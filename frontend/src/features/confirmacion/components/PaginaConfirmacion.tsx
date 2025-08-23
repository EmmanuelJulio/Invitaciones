import React from 'react';
import { useParams } from 'react-router-dom';
import { useConfirmacion } from '../hooks/useConfirmacion';
import { EventoInfo } from './EventoInfo';
import { FormularioConfirmacion } from './FormularioConfirmacion';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';

export const PaginaConfirmacion: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { data, loading, error, submitting, confirmarAsistencia, rechazarAsistencia } = useConfirmacion(token || '');

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card max-w-md mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Invitación No Encontrada
            </h3>
            <p className="text-gray-600">
              {error || 'La invitación que buscas no existe o ha expirado.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-4 sm:py-8">
      <div className="container-responsive">
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {/* Información del evento */}
          <EventoInfo evento={data.evento} />

          {/* Formulario de confirmación */}
          <FormularioConfirmacion
            nombre={data.invitado.nombre}
            estadoActual={data.invitado.estado}
            onConfirmar={confirmarAsistencia}
            onRechazar={rechazarAsistencia}
            loading={submitting}
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