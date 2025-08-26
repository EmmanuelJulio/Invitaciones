export interface InvitadoResponseDto {
  id: string;
  nombre: string;
  telefono?: string;
  token: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado' | 'confirmado_incompleto';
  mensaje?: string;
  fechaConfirmacion?: string;
  fechaCreacion: string;
  cantidadInvitaciones?: number;
  fechaLimiteEdicion?: string;
  whatsappEnviado?: boolean;
  notificado?: boolean;
  acompanantes?: AcompananteDto[];
}

export interface AcompananteDto {
  id: string;
  nombreCompleto: string;
  telefono?: string;
  invitadoId: string;
}

export interface EventoInfoDto {
  titulo: string;
  fecha: string;
  fechaFormateada: string;
  ubicacion: string;
  duracionAproximada: string;
  codigoVestimenta: string;
  notaEspecial: string;
}

export interface InvitadoConEventoDto {
  invitado: InvitadoResponseDto;
  evento: EventoInfoDto;
}

export interface EstadisticasDto {
  pendientes: number;
  confirmados: number;
  confirmadosIncompleto: number;
  rechazados: number;
  total: number;
  totalPersonas: number;
  totalPersonasConfirmadas: number;
  porcentajeConfirmacion: number;
}

export interface CrearInvitadoDto {
  nombre: string;
  telefono?: string;
  cantidadInvitaciones?: number;
  mensaje?: string;
}