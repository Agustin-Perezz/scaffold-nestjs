import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Reserva } from '../../../../../domain/entities/reserva.entity';
import { ReservaEntity } from '../../entities/reserva.entity';
import { IObtenerReservaRepository } from '../../../../../application/use-cases/reservas/obtener-reserva/obtener-reserva.repository.interface';

@Injectable()
export class ObtenerReservaRepository implements IObtenerReservaRepository {
  constructor(
    @InjectRepository(ReservaEntity)
    private readonly repository: EntityRepository<ReservaEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Reserva | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.aDominio(entity);
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