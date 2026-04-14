import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface IEliminarReservaRepository {
  obtenerPorId(id: string): Promise<Reserva | null>;
  eliminar(id: string): Promise<void>;
}
