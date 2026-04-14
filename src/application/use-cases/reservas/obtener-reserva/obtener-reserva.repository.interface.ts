import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface IObtenerReservaRepository {
  obtenerPorId(id: string): Promise<Reserva | null>;
}
