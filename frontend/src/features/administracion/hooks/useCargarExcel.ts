import { useState } from 'react';
import { excelService } from '../services/excelService';
import type { InvitadoExcel } from '../types/excel';

export const useCargarExcel = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [invitados, setInvitados] = useState<InvitadoExcel[]>([]);
  const [errores, setErrores] = useState<string[]>([]);

  const procesarExcel = async (archivo: File) => {
    setLoading(true);
    try {
      const resultado = await excelService.uploadExcel(archivo);
      
      if (resultado.success && resultado.data) {
        setInvitados(resultado.data.invitados);
        setErrores(resultado.data.errores || []);
      } else {
        setErrores([resultado.error || 'Error desconocido']);
        setInvitados([]);
      }
    } catch (error) {
      console.error('Error procesando Excel:', error);
      setErrores(['Error procesando el archivo Excel']);
      setInvitados([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmarYGuardar = async (invitadosConfirmados: InvitadoExcel[]) => {
    setLoading(true);
    try {
      const resultado = await excelService.confirmarYGuardar(invitadosConfirmados);
      
      if (resultado.success) {
        // Limpiar datos después de guardar exitosamente
        setInvitados([]);
        setErrores([]);
        
        // Opcional: mostrar mensaje de éxito
        alert(`Se guardaron ${invitadosConfirmados.length} invitados correctamente`);
        
        // Llamar callback de éxito para actualizar la lista
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrores([resultado.error || 'Error guardando invitados']);
      }
    } catch (error) {
      console.error('Error guardando invitados:', error);
      setErrores(['Error guardando los invitados']);
    } finally {
      setLoading(false);
    }
  };

  const descargarTemplate = async () => {
    try {
      await excelService.descargarTemplate();
    } catch (error) {
      console.error('Error descargando template:', error);
      alert('Error descargando el template de Excel');
    }
  };

  const limpiarDatos = () => {
    setInvitados([]);
    setErrores([]);
  };

  return {
    procesarExcel,
    confirmarYGuardar,
    descargarTemplate,
    limpiarDatos,
    loading,
    invitados,
    errores
  };
};