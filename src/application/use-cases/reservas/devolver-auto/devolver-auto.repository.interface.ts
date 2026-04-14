import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface IDevolverAutoRepository {
  obtenerPorId(id: string): Promise<Reserva | null>;
  obtenerAutoPorId(autoId: string): Promise<{ id: string; precioPorHora: number } | null>;
  guardar(reserva: Reserva): Promise<Reserva>;
}
