export interface ConfirmarAsistenciaDto {
  token: string;
  confirmado: boolean; // true = confirmar, false = rechazar
  mensaje?: string;
  acompanantes?: AcompananteCreacionDto[];
}

export interface AcompananteCreacionDto {
  nombreCompleto: string;
  telefono?: string;
}