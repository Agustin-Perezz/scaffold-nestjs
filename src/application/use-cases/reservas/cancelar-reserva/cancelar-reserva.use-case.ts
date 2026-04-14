import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICancelarReservaRepository } from './cancelar-reserva.repository.interface';
import { CancelarReservaResponseDto } from './cancelar-reserva.response.dto';
import { maquinaEstadosReserva } from '../../../../domain/entities/reserva.state-machine';

@Injectable()
export class CancelarReservaUseCase {
    constructor(
        @Inject('ICancelarReservaRepository')
        private readonly repository: ICancelarReservaRepository,
    ) {}

    async execute(id: string): Promise<CancelarReservaResponseDto> {
        const reserva = await this.repository.obtenerPorId(id);
        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }

        if (!maquinaEstadosReserva.puedeTransicionar(reserva.estado, 'cancelar')) {
            const transicionesValidas = maquinaEstadosReserva.obtenerTransicionesValidas(reserva.estado);
            throw new BadRequestException(
                `No se puede cancelar la reserva en estado '${reserva.estado}'. ` +
                `Acciones válidas: ${transicionesValidas.length > 0 ? transicionesValidas.join(', ') : 'ninguna'}`,
            );
        }

        reserva.cancelar();
        const reservaActualizada = await this.repository.guardar(reserva);

        return new CancelarReservaResponseDto({
            id: reservaActualizada.id,
            autoId: reservaActualizada.autoId,
            clienteId: reservaActualizada.clienteId,
            fechaInicio: reservaActualizada.fechaInicio,
            fechaFin: reservaActualizada.fechaFin,
            estado: reservaActualizada.estado,
            precioTotal: reservaActualizada.precioTotal,
            updatedAt: reservaActualizada.updatedAt,
        });
    }
}