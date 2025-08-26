import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { VistaPrevia } from './VistaPrevia';
import { useCargarExcel } from '../hooks/useCargarExcel';

interface CargarInvitadosProps {
  onSuccess: () => void;
}

export const CargarInvitados: React.FC<CargarInvitadosProps> = ({ onSuccess }) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const {
    procesarExcel,
    confirmarYGuardar,
    descargarTemplate,
    loading,
    invitados,
    errores,
    limpiarDatos
  } = useCargarExcel(onSuccess);

  const handleFileSelect = (file: File) => {
    setArchivo(file);
    procesarExcel(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    
    if (excelFile) {
      handleFileSelect(excelFile);
    } else {
      alert('Por favor selecciona un archivo Excel (.xlsx o .xls)');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClickArea = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleConfirmarGuardar = async () => {
    if (invitados.length > 0) {
      await confirmarYGuardar(invitados);
      setArchivo(null);
    }
  };

  const handleNuevoCarga = () => {
    setArchivo(null);
    limpiarDatos();
  };

  if (invitados.length > 0) {
    return (
      <VistaPrevia
        invitados={invitados}
        errores={errores}
        onConfirmar={handleConfirmarGuardar}
        onCancelar={handleNuevoCarga}
        loading={loading}
      />
    );
  }

  return (
    <div className="card">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Cargar Invitados desde Excel
        </h3>
        <p className="text-gray-600">
          Sube un archivo Excel con la lista de invitados para procesarlos automáticamente.
        </p>
      </div>

      {/* Botón de descargar template */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-blue-800">
                ¿Primera vez usando esta función?
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                Descarga nuestro template de Excel para asegurar el formato correcto.
              </p>
              <div className="mt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={descargarTemplate}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver 
            ? 'border-orange-400 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleClickArea}
      >
        {loading ? (
          <div className="py-8">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Procesando archivo Excel...</p>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Arrastra tu archivo Excel aquí
              </p>
              <p className="text-gray-500">
                o haz clic para seleccionar un archivo
              </p>
            </div>

            <div className="mb-4">
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label 
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Seleccionar Archivo Excel
              </label>
            </div>

            <p className="text-xs text-gray-500">
              Archivos soportados: .xlsx, .xls (máximo 5MB)
            </p>

            {archivo && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Archivo seleccionado:</strong> {archivo.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(archivo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Información sobre formato */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Formato requerido del Excel:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-gray-900">Columnas obligatorias:</strong>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li>• <code className="bg-gray-200 px-1 rounded">nombre</code> - Nombre completo del invitado</li>
            </ul>
          </div>
          <div>
            <strong className="text-gray-900">Columnas opcionales:</strong>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li>• <code className="bg-gray-200 px-1 rounded">telefono</code> - Número con código de país (para WhatsApp)</li>
              <li>• <code className="bg-gray-200 px-1 rounded">mensaje</code> - Mensaje personalizado</li>
              <li>• <code className="bg-gray-200 px-1 rounded">cantidad_invitaciones</code> - Número de personas (por defecto: 1)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};