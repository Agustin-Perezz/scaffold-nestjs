import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Reserva } from '../../../../../domain/entities/reserva.entity';
import { ReservaEntity } from '../../entities/reserva.entity';
import { IListarReservasRepository } from '../../../../../application/use-cases/reservas/listar-reservas/listar-reservas.repository.interface';

@Injectable()
export class ListarReservasRepository implements IListarReservasRepository {
  constructor(
    @InjectRepository(ReservaEntity)
    private readonly repository: EntityRepository<ReservaEntity>,
  ) {}

  async listarTodos(): Promise<Reserva[]> {
    const entities = await this.repository.findAll();
    return entities.map((e) => this.aDominio(e));
  }

  async listarPorAuto(autoId: string): Promise<Reserva[]> {
    const entities = await this.repository.find({ autoId });
    return entities.map((e) => this.aDominio(e));
  }

  async listarPorCliente(clienteId: string): Promise<Reserva[]> {
    const entities = await this.repository.find({ clienteId });
    return entities.map((e) => this.aDominio(e));
  }

  private aDominio(entity: ReservaEntity): Reserva {
    return Reserva.reconstruct({
      id: entity.id,
      autoId: entity.autoId,
      clienteId: entity.clienteId,
      fechaInicio: entity.fechaInicio,
      fechaFin: entity.fechaFin,
      fechaRetorno: entity.fechaRetorno,
      estado: entity.estado as any,
      precioTotal: entity.precioTotal,
      penalidad: entity.penalidad,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}