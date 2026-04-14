import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { Auto } from '../../../../../domain/entities/auto.entity';
import { AutoEntity } from '../../entities/auto.entity';
import { ICrearAutoRepository } from '../../../../../application/use-cases/autos/crear-auto/crear-auto.repository.interface';

@Injectable()
export class CrearAutoRepository implements ICrearAutoRepository {
  constructor(
    @InjectRepository(AutoEntity)
    private readonly repository: EntityRepository<AutoEntity>,
    private readonly orm: MikroORM,
  ) {}

  async crear(auto: Auto): Promise<Auto> {
    return this.orm.em.transactional(async (em) => {
      const entity = new AutoEntity(
        auto.marca,
        auto.modelo,
        auto.anio,
        auto.patente,
        auto.precioPorHora,
      );
      entity.id = auto.id;
      entity.disponible = auto.disponible;
      entity.createdAt = auto.createdAt;
      entity.updatedAt = auto.updatedAt;
      await em.persist(entity).flush();
      return this.aDominio(entity);
    });
  }

  async existePorPatente(patente: string): Promise<boolean> {
    const count = await this.repository.count({ patente });
    return count > 0;
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
