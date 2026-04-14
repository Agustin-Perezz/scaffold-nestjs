import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IDevolverAutoRepository } from './devolver-auto.repository.interface';
import { DevolverAutoRequestDto } from './devolver-auto.request.dto';
import { DevolverAutoResponseDto } from './devolver-auto.response.dto';
import { ESTADOS_RESERVA } from '../../../../domain/entities/reserva.entity';

@Injectable()
export class DevolverAutoUseCase {
  constructor(
    @Inject('IDevolverAutoRepository')
    private readonly repository: IDevolverAutoRepository,
  ) {}

  async execute(id: string, dto: DevolverAutoRequestDto): Promise<DevolverAutoResponseDto> {
    const reserva = await this.repository.obtenerPorId(id);
    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado !== ESTADOS_RESERVA.EN_CURSO) {
      throw new BadRequestException('Solo se puede devolver un auto de una reserva en curso');
    }

    const auto = await this.repository.obtenerAutoPorId(reserva.autoId);
    if (!auto) {
      throw new NotFoundException('Auto no encontrado');
    }

    const fechaRetorno = new Date(dto.fechaRetorno);
    const penalidadCalculada = reserva.calcularPenalidad(fechaRetorno, auto.precioPorHora);

    reserva.completar(fechaRetorno, penalidadCalculada > 0 ? penalidadCalculada : null);

    const reservaActualizada = await this.repository.guardar(reserva);

    return new DevolverAutoResponseDto({
      id: reservaActualizada.id,
      autoId: reservaActualizada.autoId,
      clienteId: reservaActualizada.clienteId,
      fechaInicio: reservaActualizada.fechaInicio,
      fechaFin: reservaActualizada.fechaFin,
      fechaRetorno: reservaActualizada.fechaRetorno,
      estado: reservaActualizada.estado,
      precioTotal: reservaActualizada.precioTotal,
      penalidad: reservaActualizada.penalidad,
      createdAt: reservaActualizada.createdAt,
      updatedAt: reservaActualizada.updatedAt,
    });
  }
}
