import { useState, useEffect } from 'react';
import { ConfirmacionService } from '../services/confirmacionService';
import type { InvitadoConEventoDto, AcompananteCreacionDto } from '../../../shared/types/api';

export const useConfirmacion = (token: string) => {
  const [data, setData] = useState<InvitadoConEventoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const cargarInvitado = async () => {
      if (!token) {
        setError('Token no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const resultado = await ConfirmacionService.obtenerInvitado(token);
        
        if (!resultado) {
          setError('Invitación no encontrada');
        } else {
          setData(resultado);
        }
      } catch (err) {
        console.error('Error cargando invitado:', err);
        setError('Error al cargar la invitación');
      } finally {
        setLoading(false);
      }
    };

    cargarInvitado();
  }, [token]);

  const confirmarAsistencia = async (mensaje?: string, acompanantes?: AcompananteCreacionDto[]) => {
    if (!token) return;

    try {
      setSubmitting(true);
      setError(null);

      const resultado = await ConfirmacionService.confirmarAsistencia({
        token,
        confirmado: true,
        mensaje,
        acompanantes,
      });

      // Actualizar el estado local
      if (data) {
        setData({
          ...data,
          invitado: resultado,
        });
      }
    } catch (err) {
      console.error('Error confirmando asistencia:', err);
      setError('Error al confirmar la asistencia');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const rechazarAsistencia = async (mensaje?: string) => {
    if (!token) return;

    try {
      setSubmitting(true);
      setError(null);

      const resultado = await ConfirmacionService.rechazarAsistencia(token, mensaje);

      // Actualizar el estado local
      if (data) {
        setData({
          ...data,
          invitado: resultado,
        });
      }
    } catch (err) {
      console.error('Error rechazando asistencia:', err);
      setError('Error al rechazar la asistencia');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    data,
    loading,
    error,
    submitting,
    confirmarAsistencia,
    rechazarAsistencia,
  };
};