export interface InvitadoResponseDto {
  id: string;
  nombre: string;
  telefono: string;
  token: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  mensaje?: string;
  fechaConfirmacion?: string;
  fechaCreacion: string;
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
  rechazados: number;
  total: number;
  porcentajeConfirmacion: number;
}

export interface CrearInvitadoDto {
  nombre: string;
  telefono: string;
  mensaje?: string;
}