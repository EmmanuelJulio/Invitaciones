import { Request, Response } from 'express';
import { ObtenerInvitado } from '../../../application/use-cases/ObtenerInvitado';
import { ConfirmarAsistencia } from '../../../application/use-cases/ConfirmarAsistencia';
import { ListarInvitados } from '../../../application/use-cases/ListarInvitados';
import { CrearInvitacion } from '../../../application/use-cases/CrearInvitacion';

export class InvitadoController {
  constructor(
    private readonly obtenerInvitado: ObtenerInvitado,
    private readonly confirmarAsistencia: ConfirmarAsistencia,
    private readonly listarInvitados: ListarInvitados,
    private readonly crearInvitacion: CrearInvitacion
  ) {}

  async obtenerPorToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      
      if (!token) {
        res.status(400).json({ error: 'Token es requerido' });
        return;
      }

      const resultado = await this.obtenerInvitado.execute(token);
      
      if (!resultado) {
        res.status(404).json({ error: 'Invitado no encontrado' });
        return;
      }

      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async confirmar(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { confirmado, mensaje } = req.body;
      
      if (!token) {
        res.status(400).json({ error: 'Token es requerido' });
        return;
      }

      if (typeof confirmado !== 'boolean') {
        res.status(400).json({ error: 'El campo confirmado es requerido y debe ser boolean' });
        return;
      }

      const resultado = await this.confirmarAsistencia.execute({
        token,
        confirmado,
        mensaje
      });

      res.json(resultado);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async rechazar(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { mensaje } = req.body;
      
      if (!token) {
        res.status(400).json({ error: 'Token es requerido' });
        return;
      }

      const resultado = await this.confirmarAsistencia.execute({
        token,
        confirmado: false,
        mensaje
      });

      res.json(resultado);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const invitados = await this.listarInvitados.execute();
      res.json(invitados);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const estadisticas = await this.listarInvitados.obtenerEstadisticas();
      res.json(estadisticas);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, telefono, mensaje } = req.body;
      
      if (!nombre || !telefono) {
        res.status(400).json({ error: 'Nombre y teléfono son requeridos' });
        return;
      }

      const resultado = await this.crearInvitacion.execute({
        nombre,
        telefono,
        mensaje
      });

      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async crearEnLote(req: Request, res: Response): Promise<void> {
    try {
      const { invitados } = req.body;
      
      if (!Array.isArray(invitados) || invitados.length === 0) {
        res.status(400).json({ error: 'Se requiere un array de invitados' });
        return;
      }

      // Validar que cada invitado tenga los campos requeridos
      for (const invitado of invitados) {
        if (!invitado.nombre || !invitado.telefono) {
          res.status(400).json({ error: 'Cada invitado debe tener nombre y teléfono' });
          return;
        }
      }

      const resultados = await this.crearInvitacion.crearEnLote(invitados);
      res.status(201).json(resultados);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}