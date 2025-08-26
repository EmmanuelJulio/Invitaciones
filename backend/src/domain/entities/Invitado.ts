import { Token } from '../value-objects/Token';
import { EstadoInvitacion } from '../value-objects/EstadoInvitacion';
import { DatosContacto } from '../value-objects/DatosContacto';

export class Invitado {
  private readonly id: string;
  private readonly token: Token;
  private datosContacto: DatosContacto;
  private estado: EstadoInvitacion;
  private mensaje?: string;
  private fechaConfirmacion?: Date;
  private readonly fechaCreacion: Date;
  private cantidadInvitaciones: number;
  private readonly fechaLimiteEdicion: Date;
  private whatsappEnviado: boolean;
  private fechaEnvioWhatsapp?: Date;
  private intentosEnvio: number;

  constructor(
    id: string,
    token: Token,
    datosContacto: DatosContacto,
    estado: EstadoInvitacion,
    cantidadInvitaciones: number = 1,
    mensaje?: string,
    fechaConfirmacion?: Date,
    fechaCreacion?: Date,
    fechaLimiteEdicion?: Date,
    whatsappEnviado: boolean = false,
    fechaEnvioWhatsapp?: Date,
    intentosEnvio: number = 0
  ) {
    this.id = id;
    this.token = token;
    this.datosContacto = datosContacto;
    this.estado = estado;
    this.cantidadInvitaciones = cantidadInvitaciones;
    this.mensaje = mensaje;
    this.fechaConfirmacion = fechaConfirmacion;
    this.fechaCreacion = fechaCreacion || new Date();
    this.fechaLimiteEdicion = fechaLimiteEdicion || new Date('2025-09-01T23:59:59.000Z');
    this.whatsappEnviado = whatsappEnviado;
    this.fechaEnvioWhatsapp = fechaEnvioWhatsapp;
    this.intentosEnvio = intentosEnvio;
  }

  static create(
    id: string,
    nombre: string,
    telefono?: string,
    cantidadInvitaciones: number = 1,
    mensaje?: string
  ): Invitado {
    const token = Token.generate();
    const datosContacto = new DatosContacto(nombre, telefono);
    const estado = EstadoInvitacion.pendiente();
    
    return new Invitado(id, token, datosContacto, estado, cantidadInvitaciones, mensaje);
  }

  confirmarAsistencia(mensaje?: string): void {
    if (this.estado.isConfirmadoCompletaOIncompleta()) {
      throw new Error('La invitación ya está confirmada');
    }
    
    // Si es una invitación individual (sin acompañantes), marcar como confirmado directamente
    if (this.cantidadInvitaciones === 1) {
      this.estado = EstadoInvitacion.confirmado();
    } else {
      // Para invitaciones con acompañantes, marcar como incompleto hasta que se agreguen
      this.estado = EstadoInvitacion.confirmadoIncompleto();
    }
    
    this.fechaConfirmacion = new Date();
    if (mensaje) {
      this.mensaje = mensaje;
    }
  }

  confirmarAsistenciaCompleta(): void {
    if (!this.estado.isConfirmadoIncompleto()) {
      throw new Error('Solo se puede completar una confirmación incompleta');
    }
    
    this.estado = EstadoInvitacion.confirmado();
  }

  rechazarAsistencia(mensaje?: string): void {
    if (this.estado.isRechazado()) {
      throw new Error('La invitación ya está rechazada');
    }
    
    this.estado = EstadoInvitacion.rechazado();
    this.fechaConfirmacion = new Date();
    if (mensaje) {
      this.mensaje = mensaje;
    }
  }

  marcarWhatsappEnviado(): void {
    this.whatsappEnviado = true;
    this.fechaEnvioWhatsapp = new Date();
    this.intentosEnvio++;
  }

  puedeEditarAcompanantes(): boolean {
    return new Date() <= this.fechaLimiteEdicion;
  }

  necesitaAcompanantes(): boolean {
    return this.cantidadInvitaciones > 1;
  }

  getMaximoAcompanantes(): number {
    return this.cantidadInvitaciones - 1; // -1 porque una invitación es para el titular
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getToken(): Token {
    return this.token;
  }

  getDatosContacto(): DatosContacto {
    return this.datosContacto;
  }

  getEstado(): EstadoInvitacion {
    return this.estado;
  }

  getMensaje(): string | undefined {
    return this.mensaje;
  }

  getFechaConfirmacion(): Date | undefined {
    return this.fechaConfirmacion;
  }

  getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  // Helper methods
  getNombre(): string {
    return this.datosContacto.getNombre();
  }

  getTelefono(): string | undefined {
    return this.datosContacto.getTelefono();
  }

  getTokenValue(): string {
    return this.token.getValue();
  }

  getEstadoValue(): string {
    return this.estado.getValue();
  }

  isPendiente(): boolean {
    return this.estado.isPendiente();
  }

  isConfirmado(): boolean {
    return this.estado.isConfirmado();
  }

  isRechazado(): boolean {
    return this.estado.isRechazado();
  }

  isConfirmadoIncompleto(): boolean {
    return this.estado.isConfirmadoIncompleto();
  }

  // Nuevos getters
  getCantidadInvitaciones(): number {
    return this.cantidadInvitaciones;
  }

  getFechaLimiteEdicion(): Date {
    return this.fechaLimiteEdicion;
  }

  getWhatsappEnviado(): boolean {
    return this.whatsappEnviado;
  }

  getFechaEnvioWhatsapp(): Date | undefined {
    return this.fechaEnvioWhatsapp;
  }

  getIntentosEnvio(): number {
    return this.intentosEnvio;
  }

  // Métodos de actualización
  actualizarDatosContacto(nuevosDatos: DatosContacto): void {
    this.datosContacto = nuevosDatos;
  }

  actualizarCantidadInvitaciones(nuevaCantidad: number): void {
    if (nuevaCantidad < 1) {
      throw new Error('La cantidad de invitaciones debe ser mayor a 0');
    }
    this.cantidadInvitaciones = nuevaCantidad;
  }

  actualizarMensaje(nuevoMensaje?: string): void {
    this.mensaje = nuevoMensaje;
  }

  incrementarIntentosEnvio(): void {
    this.intentosEnvio++;
    this.fechaEnvioWhatsapp = new Date();
  }
}