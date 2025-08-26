import React, { useState, useEffect } from 'react';

interface CuentaRegresivaProps {
  fechaEvento: string; // ISO string
}

interface TiempoRestante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

export const CuentaRegresiva: React.FC<CuentaRegresivaProps> = ({ fechaEvento }) => {
  const [tiempoRestante, setTiempoRestante] = useState<TiempoRestante>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });
  const [eventoVencido, setEventoVencido] = useState(false);

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const ahora = new Date().getTime();
      const fechaEventoTime = new Date(fechaEvento).getTime();
      const diferencia = fechaEventoTime - ahora;

      if (diferencia > 0) {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        setTiempoRestante({ dias, horas, minutos, segundos });
        setEventoVencido(false);
      } else {
        setTiempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        setEventoVencido(true);
      }
    };

    // Calcular inmediatamente
    calcularTiempoRestante();

    // Actualizar cada segundo
    const intervalo = setInterval(calcularTiempoRestante, 1000);

    // Limpiar intervalo al desmontar componente
    return () => clearInterval(intervalo);
  }, [fechaEvento]);

  if (eventoVencido) {
    return (
      <div className="bg-gradient-to-r from-blue-600/20 to-slate-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30">
        <div className="text-center">
          <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center">
            <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">¡El evento ya comenzó!</h3>
          <p className="text-sm sm:text-base text-gray-200">Esperamos que disfrutes la graduación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-slate-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Cuenta Regresiva</h3>
        <p className="text-gray-200 text-xs sm:text-sm">Tiempo restante para el evento</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {/* Días */}
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/30">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {String(tiempoRestante.dias).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300 uppercase tracking-wide">
              Días
            </div>
          </div>
        </div>

        {/* Horas */}
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/30">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {String(tiempoRestante.horas).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300 uppercase tracking-wide">
              Horas
            </div>
          </div>
        </div>

        {/* Minutos */}
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/30">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {String(tiempoRestante.minutos).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300 uppercase tracking-wide">
              Minutos
            </div>
          </div>
        </div>

        {/* Segundos */}
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/30">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
              {String(tiempoRestante.segundos).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300 uppercase tracking-wide">
              Segundos
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="mt-4 sm:mt-6 text-center">
        <div className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-white/10 rounded-lg border border-white/20">
          <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs sm:text-sm text-gray-200">
            {tiempoRestante.dias > 0 
              ? `¡Faltan ${tiempoRestante.dias} día${tiempoRestante.dias !== 1 ? 's' : ''} para celebrar!`
              : tiempoRestante.horas > 0
              ? `¡Solo ${tiempoRestante.horas} hora${tiempoRestante.horas !== 1 ? 's' : ''} más!`
              : `¡Ya casi es la hora!`
            }
          </span>
        </div>
      </div>
    </div>
  );
};