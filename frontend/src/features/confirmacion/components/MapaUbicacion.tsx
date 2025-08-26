import React from 'react';

interface MapaUbicacionProps {
  direccion?: string;
  nombreLugar?: string;
}

export const MapaUbicacion: React.FC<MapaUbicacionProps> = ({
  direccion = "Clahe Eventos Varela II, Bartolomé Mitre 674, B1888 Florencio Varela, Provincia de Buenos Aires",
  nombreLugar = "Clahe Eventos Varela II"
}) => {
  const direccionEncoded = encodeURIComponent(direccion);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${direccionEncoded}`;
  
  return (
    <div className="card">
      <div className="text-center">
        {/* Icono de ubicación centrado */}
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <div className="w-full">
          <h3 className="text-xl font-semibold text-white mb-4">
            📍 Ubicación del Evento
          </h3>
          
          <div className="space-y-3">
            {/* Nombre del lugar */}
            <div>
              <p className="text-lg font-medium text-white">
                {nombreLugar}
              </p>
            </div>

            {/* Dirección */}
            <div className="text-gray-200">
              <p className="text-sm leading-relaxed">
                {direccion}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              {/* Ver en Google Maps */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white text-sm font-medium rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ver en Google Maps
              </a>

              {/* Cómo llegar */}
              <a
                href={`https://www.google.com/maps/dir//${direccionEncoded}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-300 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Cómo llegar
              </a>
            </div>

            {/* Mapa embebido */}
            <div className="mt-4">
              <div className="relative overflow-hidden rounded-xl shadow-md border border-white/30">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${direccionEncoded}&zoom=16`}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
                
                {/* Fallback si no hay API key */}
                {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/30 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-200 mb-3">Mapa no disponible</p>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                      >
                        Ver ubicación en Google Maps
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};