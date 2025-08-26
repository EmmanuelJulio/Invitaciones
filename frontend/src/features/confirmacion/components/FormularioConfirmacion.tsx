import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { GestionAcompanantes } from './GestionAcompanantes';
import type { AcompananteCreacionDto, InvitadoResponseDto } from '../../../shared/types/api';

interface FormularioConfirmacionProps {
  invitado: InvitadoResponseDto;
  onConfirmar: (mensaje?: string, acompanantes?: AcompananteCreacionDto[]) => Promise<void>;
  onRechazar: (mensaje?: string) => Promise<void>;
  loading: boolean;
}

export const FormularioConfirmacion: React.FC<FormularioConfirmacionProps> = ({
  invitado,
  onConfirmar,
  onRechazar,
  loading,
}) => {
  const [mensaje, setMensaje] = useState('');
  const [acompanantes, setAcompanantes] = useState<AcompananteCreacionDto[]>([]);
  const [accionSeleccionada, setAccionSeleccionada] = useState<'confirmar' | 'rechazar' | null>(null);

  const { nombre, estado: estadoActual, cantidadInvitaciones, fechaLimiteEdicion } = invitado;
  const puedeEditarAcompanantes = !fechaLimiteEdicion || new Date() <= new Date(fechaLimiteEdicion);
  const necesitaAcompanantes = cantidadInvitaciones > 1;

  const handleConfirmar = async () => {
    setAccionSeleccionada('confirmar');
    try {
      await onConfirmar(mensaje.trim() || undefined, necesitaAcompanantes ? acompanantes : undefined);
    } finally {
      setAccionSeleccionada(null);
    }
  };

  const validarFormulario = () => {
    if (necesitaAcompanantes && acompanantes.length > 0) {
      return acompanantes.every(a => a.nombreCompleto.trim() !== '');
    }
    return true;
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

  if (estadoActual === 'confirmado' || estadoActual === 'confirmado_incompleto') {
    const acompanantesExistentes = invitado.acompanantes || [];
    const puedeAgregarAcompanantes = necesitaAcompanantes && 
      acompanantesExistentes.length < cantidadInvitaciones - 1 && 
      puedeEditarAcompanantes;

    return (
      <div className="space-y-6">
        <div className="card">
          <div className="text-center">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              estadoActual === 'confirmado' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <svg
                className={`h-6 w-6 ${estadoActual === 'confirmado' ? 'text-green-600' : 'text-blue-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={estadoActual === 'confirmado' ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {estadoActual === 'confirmado' ? '¡Asistencia Confirmada!' : 'Confirmación Incompleta'}
            </h3>
            <p className="text-gray-200 mb-4">
              Hola <span className="font-semibold">{nombre}</span>, 
              {estadoActual === 'confirmado' 
                ? ' ya has confirmado tu asistencia. ¡Te esperamos en este día tan especial!'
                : ' has confirmado tu asistencia, pero aún puedes completar los datos de tus acompañantes.'
              }
            </p>
            
            {necesitaAcompanantes && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{cantidadInvitaciones}</span>
                  </div>
                  <h4 className="text-blue-900 font-bold text-base">🎉 Invitación Múltiple</h4>
                </div>
                <p className="text-blue-800 font-medium text-sm">
                  Tienes derecho a {cantidadInvitaciones} invitación{cantidadInvitaciones > 1 ? 'es' : ''}:<br/>
                  <span className="text-blue-900">Tú + {cantidadInvitaciones - 1} acompañante{cantidadInvitaciones - 1 > 1 ? 's' : ''}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {necesitaAcompanantes && (
          <div className="card">
            <h4 className="text-lg font-semibold text-white mb-4">Acompañantes Registrados</h4>
            
            {acompanantesExistentes.length > 0 ? (
              <div className="space-y-3 mb-6">
                {acompanantesExistentes.map((acompanante) => (
                  <div key={acompanante.id} className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-white">{acompanante.nombreCompleto}</p>
                      {acompanante.telefono && (
                        <p className="text-sm text-gray-200">{acompanante.telefono}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-center py-4">
                No has registrado acompañantes aún.
              </p>
            )}

            {puedeAgregarAcompanantes && (
              <div className="border-t pt-4">
                <GestionAcompanantes
                  cantidadMaxima={cantidadInvitaciones}
                  acompanantesIniciales={[]}
                  onAcompanantesChange={setAcompanantes}
                  disabled={loading}
                />
                
                {acompanantes.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="primary"
                      onClick={handleConfirmar}
                      loading={isLoadingConfirmar}
                      disabled={loading || !validarFormulario()}
                      className="w-full"
                    >
                      Guardar Acompañantes
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {!puedeEditarAcompanantes && fechaLimiteEdicion && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                ⏰ El plazo para editar acompañantes venció el {new Date(fechaLimiteEdicion).toLocaleDateString('es-ES')}
              </div>
            )}
          </div>
        )}
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
          <h3 className="text-lg font-medium text-white mb-2">
            Asistencia Declinada
          </h3>
          <p className="text-gray-200">
            Hola <span className="font-semibold">{nombre}</span>, has declinado la invitación.
            Lamentamos que no puedas acompañarnos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            ¡Hola {nombre}!
          </h3>
          <p className="text-gray-200 mb-4">
            Por favor confirma tu asistencia a nuestra graduación
          </p>
          
          {necesitaAcompanantes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>🎉 ¡Tienes derecho a {cantidadInvitaciones} invitación{cantidadInvitaciones > 1 ? 'es' : ''}!</strong><br/>
                Tú + {cantidadInvitaciones - 1} acompañante{cantidadInvitaciones - 1 > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Gestión de acompañantes */}
          {necesitaAcompanantes && (
            <GestionAcompanantes
              cantidadMaxima={cantidadInvitaciones}
              acompanantesIniciales={[]}
              onAcompanantesChange={setAcompanantes}
              disabled={loading}
            />
          )}

          {/* Mensaje opcional */}
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-white mb-2">
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

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleConfirmar}
              loading={isLoadingConfirmar}
              disabled={loading || !validarFormulario()}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {necesitaAcompanantes && acompanantes.length === 0 
                ? 'Confirmar (sin acompañantes)' 
                : `Confirmar Asistencia${acompanantes.length > 0 ? ` (+${acompanantes.length})` : ''}`
              }
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
          
          {necesitaAcompanantes && acompanantes.length > 0 && (
            <div className="text-sm text-gray-200 bg-white/20 rounded p-3">
              <strong>Resumen:</strong> Confirmarás tu asistencia junto con {acompanantes.length} acompañante{acompanantes.length !== 1 ? 's' : ''}.
              Total: {acompanantes.length + 1} persona{acompanantes.length + 1 !== 1 ? 's' : ''}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};