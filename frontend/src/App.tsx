import { type FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaginaConfirmacion } from './features/confirmacion/components/PaginaConfirmacion';
import { PaginaConfirmacionDemo } from './features/confirmacion/components/PaginaConfirmacionDemo';
import { PanelAdmin } from './features/administracion/components/PanelAdmin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Ruta principal - redirige al admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Ruta de confirmación */}
          <Route path="/confirmar/:token" element={<PaginaConfirmacion />} />
          
          {/* Demo de confirmación */}
          <Route path="/demo" element={<PaginaConfirmacionDemo />} />
          
          {/* Panel de administración */}
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/admin/*" element={<PanelAdmin />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={
            <div className="min-h-screen gradient-bg flex items-center justify-center">
              <div className="card max-w-md mx-4 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Página No Encontrada
                </h3>
                <p className="text-gray-600 mb-4">
                  La página que buscas no existe.
                </p>
                <a 
                  href="/admin"
                  className="btn-primary"
                >
                  Ir al Panel de Administración
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;