import { Invitado } from '../entities/Invitado';

export class InvitacionConfirmada {
  readonly eventName = 'InvitacionConfirmada';
  readonly occurredOn: Date;
  readonly invitado: Invitado;
  readonly tipoConfirmacion: 'confirmado' | 'rechazado';

  constructor(invitado: Invitado, tipoConfirmacion: 'confirmado' | 'rechazado') {
    this.occurredOn = new Date();
    this.invitado = invitado;
    this.tipoConfirmacion = tipoConfirmacion;
  }
}