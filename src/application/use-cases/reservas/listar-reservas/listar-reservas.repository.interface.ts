import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface IListarReservasRepository {
  listarTodos(): Promise<Reserva[]>;
  listarPorAuto(autoId: string): Promise<Reserva[]>;
  listarPorCliente(clienteId: string): Promise<Reserva[]>;
}
