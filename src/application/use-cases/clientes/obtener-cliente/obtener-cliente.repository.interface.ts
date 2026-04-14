import { Cliente } from '../../../../domain/entities/cliente.entity';

export interface IObtenerClienteRepository {
  obtenerPorId(id: string): Promise<Cliente | null>;
}
