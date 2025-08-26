import React from 'react';
import { useParams } from 'react-router-dom';
import { useConfirmacion } from '../hooks/useConfirmacion';
import { EventoInfo } from './EventoInfo';
import { FormularioConfirmacion } from './FormularioConfirmacion';
import { CarruselImagenes } from './CarruselImagenes';
import { MapaUbicacion } from './MapaUbicacion';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';

export const PaginaConfirmacion: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { data, loading, error, submitting, confirmarAsistencia, rechazarAsistencia } = useConfirmacion(token || '');

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-200">Cargando invitación...</p>
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
            <h3 className="text-lg font-medium text-white mb-2">
              Invitación No Encontrada
            </h3>
            <p className="text-gray-200">
              {error || 'La invitación que buscas no existe o ha expirado.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-blue-800 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Carrusel de imágenes del evento */}
          <div className="mb-8">
            <CarruselImagenes />
          </div>

          {/* Información del evento */}
          <EventoInfo evento={data.evento} />

          {/* Mapa de ubicación */}
          <MapaUbicacion />

          {/* Formulario de confirmación */}
          <FormularioConfirmacion
            invitado={data.invitado}
            onConfirmar={confirmarAsistencia}
            onRechazar={rechazarAsistencia}
            loading={submitting}
          />

          {/* Footer elegante */}
          <div className="card text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">¿Tienes Preguntas?</h3>
              <div className="space-y-3 text-gray-200">
                <p className="text-sm leading-relaxed">
                  Si necesitas ayuda o tienes alguna consulta sobre el evento, no dudes en contactarnos.
                </p>
                <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm font-medium text-white">11-3842-7868</span>
                </div>
                <p className="text-xs text-gray-300 mt-4 pt-4 border-t border-white/30">
                  En caso de no poder asistir, por favor avisar con <strong className="text-white">48 horas de anticipación</strong>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/30">
                <p className="text-xs text-gray-300 flex items-center justify-center">
                  <span className="text-blue-400 mr-2">🎓</span>
                  Graduación 2024 • Ingeniería • Invitación Digital
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};