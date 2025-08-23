export interface ConfirmarAsistenciaDto {
  token: string;
  confirmado: boolean; // true = confirmar, false = rechazar
  mensaje?: string;
}