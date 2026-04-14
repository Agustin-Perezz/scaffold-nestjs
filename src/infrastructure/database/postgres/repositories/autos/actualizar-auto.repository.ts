import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { Auto } from '../../../../../domain/entities/auto.entity';
import { AutoEntity } from '../../entities/auto.entity';
import { IActualizarAutoRepository } from '../../../../../application/use-cases/autos/actualizar-auto/actualizar-auto.repository.interface';

@Injectable()
export class ActualizarAutoRepository implements IActualizarAutoRepository {
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

  async existePorPatente(patente: string, excludeId?: string): Promise<boolean> {
    const query = excludeId ? { patente, id: { $ne: excludeId } } : { patente };
    const count = await this.repository.count(query);
    return count > 0;
  }

  async guardar(auto: Auto): Promise<Auto> {
    return this.orm.em.transactional(async (em) => {
      const entity = await this.repository.findOne({ id: auto.id });
      if (!entity) {
        throw new Error('Auto no encontrado');
      }
      entity.marca = auto.marca;
      entity.modelo = auto.modelo;
      entity.anio = auto.anio;
      entity.patente = auto.patente;
      entity.precioPorHora = auto.precioPorHora;
      entity.disponible = auto.disponible;
      entity.updatedAt = new Date();
      await em.flush();
      return this.aDominio(entity);
    });
  }

  async actualizar(auto: Auto): Promise<Auto> {
    return this.orm.em.transactional(async (em) => {
      const entity = await this.repository.findOne({ id: auto.id });
      if (!entity) {
        throw new Error(`Auto with id ${auto.id} not found`);
      }

      entity.marca = auto.marca;
      entity.modelo = auto.modelo;
      entity.anio = auto.anio;
      entity.patente = auto.patente;
      entity.precioPorHora = auto.precioPorHora;
      entity.disponible = auto.disponible;
      entity.updatedAt = auto.updatedAt;

      await em.flush();
      return auto;
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
