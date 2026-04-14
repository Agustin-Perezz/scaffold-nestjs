import { Reserva } from '../../../../domain/entities/reserva.entity';

export interface IConfirmarReservaRepository {
    obtenerPorId(id: string): Promise<Reserva | null>;
    guardar(reserva: Reserva): Promise<Reserva>;
}