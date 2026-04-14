import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface IIniciarReservaRepository {
    obtenerPorId(id: string): Promise<Reserva | null>;
    guardar(reserva: Reserva): Promise<Reserva>;
}