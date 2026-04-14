import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Auto } from '../../../../../domain/entities/auto.entity';
import { AutoEntity } from '../../entities/auto.entity';
import { IObtenerAutoRepository } from '../../../../../application/use-cases/autos/obtener-auto/obtener-auto.repository.interface';

@Injectable()
export class ObtenerAutoRepository implements IObtenerAutoRepository {
  constructor(
    @InjectRepository(AutoEntity)
    private readonly repository: EntityRepository<AutoEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Auto | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.aDominio(entity);
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
