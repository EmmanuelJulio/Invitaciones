import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';

interface FormularioConfirmacionProps {
  nombre: string;
  estadoActual: 'pendiente' | 'confirmado' | 'rechazado';
  onConfirmar: (mensaje?: string) => Promise<void>;
  onRechazar: (mensaje?: string) => Promise<void>;
  loading: boolean;
}

export const FormularioConfirmacion: React.FC<FormularioConfirmacionProps> = ({
  nombre,
  estadoActual,
  onConfirmar,
  onRechazar,
  loading,
}) => {
  const [mensaje, setMensaje] = useState('');
  const [accionSeleccionada, setAccionSeleccionada] = useState<'confirmar' | 'rechazar' | null>(null);

  const handleConfirmar = async () => {
    setAccionSeleccionada('confirmar');
    try {
      await onConfirmar(mensaje.trim() || undefined);
    } finally {
      setAccionSeleccionada(null);
    }
  };

  const handleRechazar = async () => {
    setAccionSeleccionada('rechazar');
    try {
      await onRechazar(mensaje.trim() || undefined);
    } finally {
      setAccionSeleccionada(null);
    }
  };

  const isLoadingConfirmar = loading && accionSeleccionada === 'confirmar';
  const isLoadingRechazar = loading && accionSeleccionada === 'rechazar';

  if (estadoActual === 'confirmado') {
    return (
      <div className="card">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Asistencia Confirmada!
          </h3>
          <p className="text-gray-600">
            Hola <span className="font-semibold">{nombre}</span>, ya has confirmado tu asistencia.
            ¡Te esperamos en este día tan especial!
          </p>
        </div>
      </div>
    );
  }

  if (estadoActual === 'rechazado') {
    return (
      <div className="card">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Asistencia Declinada
          </h3>
          <p className="text-gray-600">
            Hola <span className="font-semibold">{nombre}</span>, has declinado la invitación.
            Lamentamos que no puedas acompañarnos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Hola {nombre}!
        </h3>
        <p className="text-gray-600">
          Por favor confirma tu asistencia a nuestra graduación
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje (opcional)
          </label>
          <textarea
            id="mensaje"
            rows={3}
            className="form-input"
            placeholder="Deja un mensaje opcional..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleConfirmar}
            loading={isLoadingConfirmar}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmar Asistencia
          </Button>

          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleRechazar}
            loading={isLoadingRechazar}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            No Podré Asistir
          </Button>
        </div>
      </div>
    </div>
  );
};