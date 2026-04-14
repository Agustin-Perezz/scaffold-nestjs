import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Cliente } from '../../../../../domain/entities/cliente.entity';
import { ClienteEntity } from '../../entities/cliente.entity';
import { ICrearClienteRepository } from '../../../../../application/use-cases/clientes/crear-cliente/crear-cliente.repository.interface';

@Injectable()
export class CrearClienteRepository implements ICrearClienteRepository {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly repository: EntityRepository<ClienteEntity>,
  ) {}

  async crear(cliente: Cliente): Promise<Cliente> {
    const entity = new ClienteEntity(
      cliente.nombre,
      cliente.apellido,
      cliente.dni,
      cliente.telefono,
    );
    entity.id = cliente.id;
    entity.email = cliente.email;
    entity.createdAt = cliente.createdAt;
    entity.updatedAt = cliente.updatedAt;

    await this.repository.getEntityManager().persist(entity).flush();
    return cliente;
  }

  async existePorDni(dni: string): Promise<boolean> {
    const count = await this.repository.count({ dni });
    return count > 0;
  }
}