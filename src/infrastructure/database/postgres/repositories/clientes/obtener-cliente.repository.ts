import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Cliente } from '../../../../../domain/entities/cliente.entity';
import { ClienteEntity } from '../../entities/cliente.entity';
import { IObtenerClienteRepository } from '../../../../../application/use-cases/clientes/obtener-cliente/obtener-cliente.repository.interface';

@Injectable()
export class ObtenerClienteRepository implements IObtenerClienteRepository {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly repository: EntityRepository<ClienteEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Cliente | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.aDominio(entity);
  }

  private aDominio(entity: ClienteEntity): Cliente {
    return Cliente.reconstruct({
      id: entity.id,
      nombre: entity.nombre,
      apellido: entity.apellido,
      dni: entity.dni,
      telefono: entity.telefono,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}