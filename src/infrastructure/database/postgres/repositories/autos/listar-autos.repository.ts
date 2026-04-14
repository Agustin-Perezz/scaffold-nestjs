import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Auto } from '../../../../../domain/entities/auto.entity';
import { AutoEntity } from '../../entities/auto.entity';
import { IListarAutosRepository } from '../../../../../application/use-cases/autos/listar-autos/listar-autos.repository.interface';

@Injectable()
export class ListarAutosRepository implements IListarAutosRepository {
  constructor(
    @InjectRepository(AutoEntity)
    private readonly repository: EntityRepository<AutoEntity>,
  ) {}

  async listarTodos(): Promise<Auto[]> {
    const entities = await this.repository.findAll();
    return entities.map((e) => this.aDominio(e));
  }

  async listarDisponibles(): Promise<Auto[]> {
    const entities = await this.repository.find({ disponible: true });
    return entities.map((e) => this.aDominio(e));
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
