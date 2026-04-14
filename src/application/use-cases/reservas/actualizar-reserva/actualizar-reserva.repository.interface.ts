import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface IActualizarReservaRepository {
  obtenerPorId(id: string): Promise<Reserva | null>;
  guardar(reserva: Reserva): Promise<Reserva>;
}
