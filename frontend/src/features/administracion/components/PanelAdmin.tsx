import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { LoginForm } from './LoginForm';
import { EstadisticasCard } from './EstadisticasCard';
import { TablaInvitadosEnhanced } from './TablaInvitadosEnhanced';
import { CargarInvitados } from './CargarInvitados';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { Button } from '../../../shared/components/Button';

type TabType = 'lista' | 'cargar';

export const PanelAdmin: React.FC = () => {
  const { isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const { 
    invitados, 
    estadisticas, 
    loading: adminLoading, 
    error, 
    cargarInvitados, 
    exportarCSV, 
    exportarMensajesWhatsApp,
    eliminarInvitado,
    eliminarTodosInvitados,
    actualizarInvitado
  } = useAdmin();
  const [tabActiva, setTabActiva] = useState<TabType>('lista');


  if (authLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-6" withLogo={true} />
          <h3 className="text-xl font-semibold text-white mb-2">Panel de Administración</h3>
          <p className="text-gray-200">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} loading={false} />;
  }

  if (adminLoading && !estadisticas) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-6" withLogo={true} />
          <h3 className="text-xl font-semibold text-white mb-2">Panel de Administración</h3>
          <p className="text-gray-200">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Gestión de invitaciones de graduación</p>
            </div>
            
            <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4 flex-shrink-0">
              <Button
                variant="secondary"
                onClick={cargarInvitados}
                loading={adminLoading}
                className="flex items-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Actualizar</span>
                <span className="sm:hidden">↻</span>
              </Button>
              
              <Button
                variant="danger"
                onClick={logout}
                className="flex items-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-2 sm:px-4 lg:px-6 py-8">
        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Estadísticas */}
          {estadisticas && (
            <EstadisticasCard estadisticas={estadisticas} />
          )}

          {/* Navegación por pestañas */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setTabActiva('lista')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    tabActiva === 'lista'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Lista de Invitados
                </button>
                
                <button
                  onClick={() => setTabActiva('cargar')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    tabActiva === 'cargar'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Cargar desde Excel
                </button>
              </nav>
            </div>

            {/* Contenido de las pestañas */}
            <div className="p-6">
              {tabActiva === 'lista' && (
                <TablaInvitadosEnhanced 
                  invitados={invitados} 
                  onExportar={exportarCSV}
                  onExportarMensajesWhatsApp={exportarMensajesWhatsApp}
                  onEliminarInvitado={eliminarInvitado}
                  onEliminarTodos={eliminarTodosInvitados}
                  onActualizarInvitado={actualizarInvitado}
                  loading={adminLoading}
                />
              )}
              
              {tabActiva === 'cargar' && (
                <CargarInvitados onSuccess={cargarInvitados} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};