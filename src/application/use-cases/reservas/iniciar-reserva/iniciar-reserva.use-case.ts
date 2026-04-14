import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IIniciarReservaRepository } from './iniciar-reserva.repository.interface';
import { IniciarReservaResponseDto } from './iniciar-reserva.response.dto';
import { maquinaEstadosReserva } from '../../../../domain/entities/reserva.state-machine';

@Injectable()
export class IniciarReservaUseCase {
    constructor(
        @Inject('IIniciarReservaRepository')
        private readonly repository: IIniciarReservaRepository,
    ) {}

    async execute(id: string): Promise<IniciarReservaResponseDto> {
        const reserva = await this.repository.obtenerPorId(id);
        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }

        if (!maquinaEstadosReserva.puedeTransicionar(reserva.estado, 'iniciar')) {
            const transicionesValidas = maquinaEstadosReserva.obtenerTransicionesValidas(reserva.estado);
            throw new BadRequestException(
                `No se puede iniciar la reserva en estado '${reserva.estado}'. ` +
                `Acciones válidas: ${transicionesValidas.join(', ')}`,
            );
        }

        reserva.iniciar();
        const reservaActualizada = await this.repository.guardar(reserva);

        return new IniciarReservaResponseDto({
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