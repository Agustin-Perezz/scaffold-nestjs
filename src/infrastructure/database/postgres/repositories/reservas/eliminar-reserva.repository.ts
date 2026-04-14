import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM, SqlEntityManager } from '@mikro-orm/postgresql';
import { Reserva } from '../../../../../domain/entities/reserva.entity';
import { ReservaEntity } from '../../entities/reserva.entity';
import { IEliminarReservaRepository } from '../../../../../application/use-cases/reservas/eliminar-reserva/eliminar-reserva.repository.interface';

@Injectable()
export class EliminarReservaRepository implements IEliminarReservaRepository {
  constructor(
    @InjectRepository(ReservaEntity)
    private readonly repository: EntityRepository<ReservaEntity>,
    private readonly orm: MikroORM,
  ) {}

  async obtenerPorId(id: string): Promise<Reserva | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.aDominio(entity);
  }

  async eliminar(id: string): Promise<void> {
    return this.orm.em.transactional(async (em: SqlEntityManager) => {
      const entity = await this.repository.findOne({ id });
      if (entity) {
        await em.remove(entity).flush();
      }
    });
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