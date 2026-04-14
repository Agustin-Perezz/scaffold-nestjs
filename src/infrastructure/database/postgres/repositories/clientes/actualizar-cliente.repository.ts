import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Cliente } from '../../../../../domain/entities/cliente.entity';
import { ClienteEntity } from '../../entities/cliente.entity';
import { IActualizarClienteRepository } from '../../../../../application/use-cases/clientes/actualizar-cliente/actualizar-cliente.repository.interface';

@Injectable()
export class ActualizarClienteRepository implements IActualizarClienteRepository {
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

  async existePorDni(dni: string, excludeId?: string): Promise<boolean> {
    const query = excludeId ? { dni, id: { $ne: excludeId } } : { dni };
    const count = await this.repository.count(query);
    return count > 0;
  }

  async guardar(cliente: Cliente): Promise<Cliente> {
    const entity = await this.repository.findOne({ id: cliente.id });
    if (!entity) {
      throw new Error('Cliente no encontrado');
    }
    entity.nombre = cliente.nombre;
    entity.apellido = cliente.apellido;
    entity.telefono = cliente.telefono;
    entity.email = cliente.email;
    entity.updatedAt = new Date();
    await this.repository.getEntityManager().flush();
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