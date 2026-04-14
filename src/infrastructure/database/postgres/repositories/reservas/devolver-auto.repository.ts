import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM, SqlEntityManager } from '@mikro-orm/postgresql';
import { Reserva } from '../../../../../domain/entities/reserva.entity';
import { ReservaEntity } from '../../entities/reserva.entity';
import { AutoEntity } from '../../entities/auto.entity';
import { IDevolverAutoRepository } from '../../../../../application/use-cases/reservas/devolver-auto/devolver-auto.repository.interface';

@Injectable()
export class DevolverAutoRepository implements IDevolverAutoRepository {
  constructor(
    @InjectRepository(ReservaEntity)
    private readonly reservaRepository: EntityRepository<ReservaEntity>,
    @InjectRepository(AutoEntity)
    private readonly autoRepository: EntityRepository<AutoEntity>,
    private readonly orm: MikroORM,
  ) {}

  async obtenerPorId(id: string): Promise<Reserva | null> {
    const entity = await this.reservaRepository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.aDominio(entity);
  }

  async obtenerAutoPorId(autoId: string): Promise<{ id: string; precioPorHora: number } | null> {
    const auto = await this.autoRepository.findOne({ id: autoId });
    if (!auto) {
      return null;
    }
    return {
      id: auto.id,
      precioPorHora: auto.precioPorHora,
    };
  }

  async guardar(reserva: Reserva): Promise<Reserva> {
    return this.orm.em.transactional(async (em: SqlEntityManager) => {
      const entity = await this.reservaRepository.findOne({ id: reserva.id });
      if (!entity) {
        throw new Error('Reserva no encontrada');
      }
      entity.fechaRetorno = reserva.fechaRetorno;
      entity.penalidad = reserva.penalidad;
      entity.estado = reserva.estado;
      entity.updatedAt = new Date();
      await em.flush();
      return this.aDominio(entity);
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