export class Acompanante {
  private readonly id: string;
  private readonly invitadoId: string;
  private nombreCompleto: string;
  private telefono?: string;
  private readonly fechaCreacion: Date;
  private fechaActualizacion: Date;

  constructor(
    id: string,
    invitadoId: string,
    nombreCompleto: string,
    telefono?: string,
    fechaCreacion?: Date,
    fechaActualizacion?: Date
  ) {
    this.id = id;
    this.invitadoId = invitadoId;
    this.nombreCompleto = nombreCompleto;
    this.telefono = telefono;
    this.fechaCreacion = fechaCreacion || new Date();
    this.fechaActualizacion = fechaActualizacion || new Date();

    this.validateNombreCompleto();
  }

  static create(
    id: string,
    invitadoId: string,
    nombreCompleto: string,
    telefono?: string
  ): Acompanante {
    return new Acompanante(id, invitadoId, nombreCompleto, telefono);
  }

  // Métodos de negocio
  actualizarDatos(nombreCompleto: string, telefono?: string): void {
    this.nombreCompleto = nombreCompleto;
    this.telefono = telefono;
    this.fechaActualizacion = new Date();
    
    this.validateNombreCompleto();
  }

  private validateNombreCompleto(): void {
    if (!this.nombreCompleto || this.nombreCompleto.trim().length === 0) {
      throw new Error('El nombre completo del acompañante es requerido');
    }

    if (this.nombreCompleto.trim().length < 2) {
      throw new Error('El nombre completo debe tener al menos 2 caracteres');
    }

    if (this.nombreCompleto.length > 100) {
      throw new Error('El nombre completo no puede exceder 100 caracteres');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getInvitadoId(): string {
    return this.invitadoId;
  }

  getNombreCompleto(): string {
    return this.nombreCompleto;
  }

  getTelefono(): string | undefined {
    return this.telefono;
  }

  getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  getFechaActualizacion(): Date {
    return this.fechaActualizacion;
  }

  // Helper methods
  tieneTelefono(): boolean {
    return this.telefono !== undefined && this.telefono.trim().length > 0;
  }

  equals(other: Acompanante): boolean {
    return this.id === other.id;
  }

  toJSON() {
    return {
      id: this.id,
      invitadoId: this.invitadoId,
      nombreCompleto: this.nombreCompleto,
      telefono: this.telefono,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}