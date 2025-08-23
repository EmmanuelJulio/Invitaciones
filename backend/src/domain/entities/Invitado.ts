import { Token } from '../value-objects/Token';
import { EstadoInvitacion } from '../value-objects/EstadoInvitacion';
import { DatosContacto } from '../value-objects/DatosContacto';

export class Invitado {
  private readonly id: string;
  private readonly token: Token;
  private readonly datosContacto: DatosContacto;
  private estado: EstadoInvitacion;
  private mensaje?: string;
  private fechaConfirmacion?: Date;
  private readonly fechaCreacion: Date;

  constructor(
    id: string,
    token: Token,
    datosContacto: DatosContacto,
    estado: EstadoInvitacion,
    mensaje?: string,
    fechaConfirmacion?: Date,
    fechaCreacion?: Date
  ) {
    this.id = id;
    this.token = token;
    this.datosContacto = datosContacto;
    this.estado = estado;
    this.mensaje = mensaje;
    this.fechaConfirmacion = fechaConfirmacion;
    this.fechaCreacion = fechaCreacion || new Date();
  }

  static create(
    id: string,
    nombre: string,
    telefono: string,
    mensaje?: string
  ): Invitado {
    const token = Token.generate();
    const datosContacto = new DatosContacto(nombre, telefono);
    const estado = EstadoInvitacion.pendiente();
    
    return new Invitado(id, token, datosContacto, estado, mensaje);
  }

  confirmarAsistencia(mensaje?: string): void {
    if (this.estado.isConfirmado()) {
      throw new Error('La invitación ya está confirmada');
    }
    
    this.estado = EstadoInvitacion.confirmado();
    this.fechaConfirmacion = new Date();
    if (mensaje) {
      this.mensaje = mensaje;
    }
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

  getTelefono(): string {
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
}