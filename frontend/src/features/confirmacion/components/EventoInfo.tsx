import React from 'react';
import type { EventoInfoDto } from '../../../shared/types/api';

interface EventoInfoProps {
  evento: EventoInfoDto;
}

export const EventoInfo: React.FC<EventoInfoProps> = ({ evento }) => {
  return (
    <div className="card space-y-6 fade-in">
      <div className="text-center">
        <h1 className="text-responsive-xl font-bold text-gray-900 mb-4">
          {evento.titulo}
        </h1>
        <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
              </svg>
            </div>
            <span className="font-medium text-sm sm:text-base text-center sm:text-left">{evento.fechaFormateada}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3 text-gray-700">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-medium text-center text-sm sm:text-base">{evento.ubicacion}</span>
        </div>

        <div className="flex items-center justify-center space-x-3 text-gray-700">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-medium text-center text-sm sm:text-base">{evento.duracionAproximada}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586L15.828 6H21a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h5.172l2.414-2.414A2 2 0 0112 3h5z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Código de Vestimenta:</span>
        </div>
        <p className="text-gray-700 text-sm sm:text-base ml-0 sm:ml-8 font-medium">{evento.codigoVestimenta}</p>
      </div>

      {evento.notaEspecial && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 sm:p-6 rounded-r-xl">
          <div className="flex items-start space-x-3 mb-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span className="font-semibold text-amber-800 text-sm sm:text-base">Nota Importante:</span>
          </div>
          <p className="text-amber-700 text-sm sm:text-base ml-0 sm:ml-8 leading-relaxed">{evento.notaEspecial}</p>
        </div>
      )}
    </div>
  );
};