import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IConfirmarReservaRepository } from './confirmar-reserva.repository.interface';
import { ConfirmarReservaResponseDto } from './confirmar-reserva.response.dto';
import { maquinaEstadosReserva } from '../../../../domain/entities/reserva.state-machine';

@Injectable()
export class ConfirmarReservaUseCase {
    constructor(
        @Inject('IConfirmarReservaRepository')
        private readonly repository: IConfirmarReservaRepository,
    ) {}

    async execute(id: string): Promise<ConfirmarReservaResponseDto> {
        const reserva = await this.repository.obtenerPorId(id);
        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }

        if (!maquinaEstadosReserva.puedeTransicionar(reserva.estado, 'confirmar')) {
            const transicionesValidas = maquinaEstadosReserva.obtenerTransicionesValidas(reserva.estado);
            throw new BadRequestException(
                `No se puede confirmar la reserva en estado '${reserva.estado}'. ` +
                `Acciones válidas: ${transicionesValidas.join(', ')}`,
            );
        }

        reserva.confirmar();
        const reservaActualizada = await this.repository.guardar(reserva);

        return new ConfirmarReservaResponseDto({
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