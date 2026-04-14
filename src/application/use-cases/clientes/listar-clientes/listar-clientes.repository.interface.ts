import { Cliente } from '../../../../domain/entities/cliente.entity';

export interface IListarClientesRepository {
  listarTodos(): Promise<Cliente[]>;
}
