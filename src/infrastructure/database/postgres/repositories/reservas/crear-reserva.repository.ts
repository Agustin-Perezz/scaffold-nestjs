import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM, SqlEntityManager } from '@mikro-orm/postgresql';
import { Reserva, ESTADOS_RESERVA } from '../../../../../domain/entities/reserva.entity';
import { ReservaEntity } from '../../entities/reserva.entity';
import { AutoEntity } from '../../entities/auto.entity';
import { ICrearReservaRepository } from '../../../../../application/use-cases/reservas/crear-reserva/crear-reserva.repository.interface';

@Injectable()
export class CrearReservaRepository implements ICrearReservaRepository {
  constructor(
    @InjectRepository(ReservaEntity)
    private readonly reservaRepository: EntityRepository<ReservaEntity>,
    @InjectRepository(AutoEntity)
    private readonly autoRepository: EntityRepository<AutoEntity>,
    private readonly orm: MikroORM,
  ) {}

  async crear(reserva: Reserva): Promise<Reserva> {
    return this.orm.em.transactional(async (em: SqlEntityManager) => {
      const entity = new ReservaEntity(
        reserva.autoId,
        reserva.clienteId,
        reserva.fechaInicio,
        reserva.fechaFin,
        reserva.precioTotal,
      );
      entity.id = reserva.id;
      entity.estado = reserva.estado;
      entity.fechaRetorno = reserva.fechaRetorno;
      entity.penalidad = reserva.penalidad;
      entity.createdAt = reserva.createdAt;
      entity.updatedAt = reserva.updatedAt;
      await em.persist(entity).flush();
      return this.aDominio(entity);
    });
  }

  async obtenerAutoPorId(autoId: string): Promise<{ id: string; disponible: boolean; precioPorHora: number } | null> {
    const auto = await this.autoRepository.findOne({ id: autoId });
    if (!auto) {
      return null;
    }
    return {
      id: auto.id,
      disponible: auto.disponible,
      precioPorHora: auto.precioPorHora,
    };
  }

  async tieneReservasSolapadas(autoId: string, fechaInicio: Date, fechaFin: Date): Promise<boolean> {
    const reservasActivas = [ESTADOS_RESERVA.PENDIENTE, ESTADOS_RESERVA.CONFIRMADA, ESTADOS_RESERVA.EN_CURSO];
    const reservas = await this.reservaRepository.find({
      autoId,
      estado: { $in: reservasActivas },
    });

    for (const reserva of reservas) {
      if (reserva.fechaInicio < fechaFin && reserva.fechaFin > fechaInicio) {
        return true;
      }
    }
    return false;
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