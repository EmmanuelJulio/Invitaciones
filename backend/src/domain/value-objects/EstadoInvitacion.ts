export enum EstadoInvitacionEnum {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  CONFIRMADO_INCOMPLETO = 'confirmado_incompleto',
  RECHAZADO = 'rechazado'
}

export class EstadoInvitacion {
  private readonly value: EstadoInvitacionEnum;

  constructor(value: EstadoInvitacionEnum) {
    this.value = value;
  }

  getValue(): EstadoInvitacionEnum {
    return this.value;
  }

  equals(other: EstadoInvitacion): boolean {
    return this.value === other.value;
  }

  isPendiente(): boolean {
    return this.value === EstadoInvitacionEnum.PENDIENTE;
  }

  isConfirmado(): boolean {
    return this.value === EstadoInvitacionEnum.CONFIRMADO;
  }

  isConfirmadoIncompleto(): boolean {
    return this.value === EstadoInvitacionEnum.CONFIRMADO_INCOMPLETO;
  }

  isConfirmadoCompletaOIncompleta(): boolean {
    return this.value === EstadoInvitacionEnum.CONFIRMADO || this.value === EstadoInvitacionEnum.CONFIRMADO_INCOMPLETO;
  }

  isRechazado(): boolean {
    return this.value === EstadoInvitacionEnum.RECHAZADO;
  }

  static pendiente(): EstadoInvitacion {
    return new EstadoInvitacion(EstadoInvitacionEnum.PENDIENTE);
  }

  static confirmado(): EstadoInvitacion {
    return new EstadoInvitacion(EstadoInvitacionEnum.CONFIRMADO);
  }

  static confirmadoIncompleto(): EstadoInvitacion {
    return new EstadoInvitacion(EstadoInvitacionEnum.CONFIRMADO_INCOMPLETO);
  }

  static rechazado(): EstadoInvitacion {
    return new EstadoInvitacion(EstadoInvitacionEnum.RECHAZADO);
  }

  static fromString(value: string): EstadoInvitacion {
    switch (value.toLowerCase()) {
      case 'pendiente':
        return EstadoInvitacion.pendiente();
      case 'confirmado':
        return EstadoInvitacion.confirmado();
      case 'confirmado_incompleto':
        return EstadoInvitacion.confirmadoIncompleto();
      case 'rechazado':
        return EstadoInvitacion.rechazado();
      default:
        throw new Error(`Invalid EstadoInvitacion: ${value}`);
    }
  }
}