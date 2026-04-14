import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface ICrearReservaRepository {
  crear(reserva: Reserva): Promise<Reserva>;
  obtenerAutoPorId(autoId: string): Promise<{ id: string; disponible: boolean; precioPorHora: number } | null>;
  tieneReservasSolapadas(autoId: string, fechaInicio: Date, fechaFin: Date): Promise<boolean>;
}
