import { Cliente } from '../../../../domain/entities/cliente.entity';

export interface ICrearClienteRepository {
  crear(cliente: Cliente): Promise<Cliente>;
  existePorDni(dni: string): Promise<boolean>;
}
