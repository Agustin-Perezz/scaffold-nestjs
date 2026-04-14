import { Cliente } from '../../../../domain/entities/cliente.entity';

export interface IEliminarClienteRepository {
  obtenerPorId(id: string): Promise<Cliente | null>;
  eliminar(id: string): Promise<void>;
}
