import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { Auto } from '../../../../../domain/entities/auto.entity';
import { AutoEntity } from '../../entities/auto.entity';
import { IEliminarAutoRepository } from '../../../../../application/use-cases/autos/eliminar-auto/eliminar-auto.repository.interface';

@Injectable()
export class EliminarAutoRepository implements IEliminarAutoRepository {
  constructor(
    @InjectRepository(AutoEntity)
    private readonly repository: EntityRepository<AutoEntity>,
    private readonly orm: MikroORM,
  ) {}

  async obtenerPorId(id: string): Promise<Auto | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.aDominio(entity);
  }

  async eliminar(id: string): Promise<void> {
    return this.orm.em.transactional(async (em) => {
      const entity = await this.repository.findOne({ id });
      if (entity) {
        await em.remove(entity).flush();
      }
    });
  }

  private aDominio(entity: AutoEntity): Auto {
    return Auto.reconstruct({
      id: entity.id,
      marca: entity.marca,
      modelo: entity.modelo,
      anio: entity.anio,
      patente: entity.patente,
      precioPorHora: entity.precioPorHora,
      disponible: entity.disponible,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
