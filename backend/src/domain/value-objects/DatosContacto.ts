export class DatosContacto {
  private readonly nombre: string;
  private readonly telefono?: string;

  constructor(nombre: string, telefono?: string) {
    this.validateNombre(nombre);
    if (telefono) {
      this.validateTelefono(telefono);
    }
    
    this.nombre = nombre.trim();
    this.telefono = telefono?.trim();
  }

  private validateNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }
    
    if (nombre.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    
    if (nombre.trim().length > 100) {
      throw new Error('El nombre no puede tener más de 100 caracteres');
    }
  }

  private validateTelefono(telefono: string): void {
    if (!telefono || telefono.trim().length === 0) {
      return; // Teléfono opcional
    }
    
    // Remove spaces, dashes, and parentheses for validation
    const cleanPhone = telefono.replace(/[\s\-\(\)]/g, '');
    
    if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) {
      throw new Error('El formato del teléfono no es válido');
    }
  }

  getNombre(): string {
    return this.nombre;
  }

  getTelefono(): string | undefined {
    return this.telefono;
  }

  getTelefonoLimpio(): string | undefined {
    return this.telefono?.replace(/[\s\-\(\)]/g, '');
  }

  equals(other: DatosContacto): boolean {
    return this.nombre === other.nombre && this.telefono === other.telefono;
  }
}