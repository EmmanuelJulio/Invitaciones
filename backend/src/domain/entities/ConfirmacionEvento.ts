export class ConfirmacionEvento {
  private readonly titulo: string;
  private readonly fecha: Date;
  private readonly ubicacion: string;
  private readonly duracionAproximada: string;
  private readonly codigoVestimenta: string;
  private readonly notaEspecial: string;

  constructor(
    titulo: string,
    fecha: Date,
    ubicacion: string,
    duracionAproximada: string,
    codigoVestimenta: string,
    notaEspecial: string
  ) {
    this.titulo = titulo;
    this.fecha = fecha;
    this.ubicacion = ubicacion;
    this.duracionAproximada = duracionAproximada;
    this.codigoVestimenta = codigoVestimenta;
    this.notaEspecial = notaEspecial;
  }

  static graduacion2024(): ConfirmacionEvento {
    return new ConfirmacionEvento(
      'Invitación a Evento Graduación',
      new Date('2025-09-06T19:00:00'), // Sábado 6 de septiembre 19 hs
      'Salón de Eventos Varela II',
      'Aproximadamente 7 horas',
      'Elegante Sport',
      'Por motivo de las elecciones, el servicio de alcohol finalizará a las 12 de la noche.'
    );
  }

  getTitulo(): string {
    return this.titulo;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getUbicacion(): string {
    return this.ubicacion;
  }

  getDuracionAproximada(): string {
    return this.duracionAproximada;
  }

  getCodigoVestimenta(): string {
    return this.codigoVestimenta;
  }

  getNotaEspecial(): string {
    return this.notaEspecial;
  }

  getFechaFormateada(): string {
    return this.fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}