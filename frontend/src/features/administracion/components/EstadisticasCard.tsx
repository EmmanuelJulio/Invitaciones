import React from 'react';
import type { EstadisticasDto } from '../../../shared/types/api';

interface EstadisticasCardProps {
  estadisticas: EstadisticasDto;
}

interface StatItem {
  name: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export const EstadisticasCard: React.FC<EstadisticasCardProps> = ({ estadisticas }) => {
  const stats: StatItem[] = [
    {
      name: 'Total Invitados',
      value: estadisticas.total,
      subtitle: `${estadisticas.totalPersonas} personas`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-gray-200',
      bgColor: 'bg-white/20',
    },
    {
      name: 'Confirmados',
      value: estadisticas.confirmados,
      subtitle: `${estadisticas.totalPersonasConfirmadas} personas`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Parcialmente',
      value: estadisticas.confirmadosIncompleto,
      subtitle: 'confirmados',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
    },
    {
      name: 'Pendientes',
      value: estadisticas.pendientes,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30',
    },
    {
      name: 'Rechazados',
      value: estadisticas.rechazados,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Estadísticas Generales</h3>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-blue-400">
            {estadisticas.porcentajeConfirmacion}%
          </div>
          <span className="text-gray-200">de confirmación</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-200">
              {stat.name}
            </div>
            {stat.subtitle && (
              <div className="text-xs text-gray-300 mt-1">
                {stat.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>

      {estadisticas.total > 0 && (
        <div className="mt-6 pt-6 border-t border-white/30">
          <div className="bg-white/30 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${estadisticas.porcentajeConfirmacion}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-200">
            Progreso de confirmaciones
          </div>
        </div>
      )}
    </div>
  );
};