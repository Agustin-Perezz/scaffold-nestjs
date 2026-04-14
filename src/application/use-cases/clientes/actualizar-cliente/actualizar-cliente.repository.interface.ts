import { Cliente } from '../../../../domain/entities/cliente.entity';

export interface IActualizarClienteRepository {
  obtenerPorId(id: string): Promise<Cliente | null>;
  existePorDni(dni: string, excludeId?: string): Promise<boolean>;
  guardar(cliente: Cliente): Promise<Cliente>;
}
