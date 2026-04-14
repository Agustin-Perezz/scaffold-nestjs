import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IObtenerReservaRepository } from './obtener-reserva.repository.interface';
import { ObtenerReservaResponseDto } from './obtener-reserva.response.dto';

@Injectable()
export class ObtenerReservaUseCase {
  constructor(
    @Inject('IObtenerReservaRepository')
    private readonly repository: IObtenerReservaRepository,
  ) {}

  async execute(id: string): Promise<ObtenerReservaResponseDto> {
    const reserva = await this.repository.obtenerPorId(id);
    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return new ObtenerReservaResponseDto({
      id: reserva.id,
      autoId: reserva.autoId,
      clienteId: reserva.clienteId,
      fechaInicio: reserva.fechaInicio,
      fechaFin: reserva.fechaFin,
      fechaRetorno: reserva.fechaRetorno,
      estado: reserva.estado,
      precioTotal: reserva.precioTotal,
      penalidad: reserva.penalidad,
      createdAt: reserva.createdAt,
      updatedAt: reserva.updatedAt,
    });
  }
}
