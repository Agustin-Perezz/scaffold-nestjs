import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Cliente } from '../../../../../domain/entities/cliente.entity';
import { ClienteEntity } from '../../entities/cliente.entity';
import { IListarClientesRepository } from '../../../../../application/use-cases/clientes/listar-clientes/listar-clientes.repository.interface';

@Injectable()
export class ListarClientesRepository implements IListarClientesRepository {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly repository: EntityRepository<ClienteEntity>,
  ) {}

  async listarTodos(): Promise<Cliente[]> {
    const entities = await this.repository.findAll();
    return entities.map((e) => this.aDominio(e));
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