import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { Invitado } from '../../domain/entities/Invitado';
import { CrearInvitadoDto, InvitadoResponseDto } from '../dtos/InvitadoResponseDto';
import { v4 as uuidv4 } from 'uuid';

export class CrearInvitacion {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(dto: CrearInvitadoDto): Promise<InvitadoResponseDto> {
    try {
      const id = uuidv4();
      const invitado = Invitado.create(id, dto.nombre, dto.telefono, dto.mensaje);
      
      const invitadoGuardado = await this.invitadoRepository.save(invitado);

      return {
        id: invitadoGuardado.getId(),
        nombre: invitadoGuardado.getNombre(),
        telefono: invitadoGuardado.getTelefono(),
        token: invitadoGuardado.getTokenValue(),
        estado: invitadoGuardado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado',
        mensaje: invitadoGuardado.getMensaje(),
        fechaConfirmacion: invitadoGuardado.getFechaConfirmacion()?.toISOString(),
        fechaCreacion: invitadoGuardado.getFechaCreacion().toISOString()
      };
    } catch (error) {
      throw new Error(`Error al crear invitación: ${(error as Error).message}`);
    }
  }

  async crearEnLote(invitados: CrearInvitadoDto[]): Promise<InvitadoResponseDto[]> {
    try {
      const resultados: InvitadoResponseDto[] = [];
      
      for (const invitadoDto of invitados) {
        const resultado = await this.execute(invitadoDto);
        resultados.push(resultado);
      }
      
      return resultados;
    } catch (error) {
      throw new Error(`Error al crear invitaciones en lote: ${(error as Error).message}`);
    }
  }
}