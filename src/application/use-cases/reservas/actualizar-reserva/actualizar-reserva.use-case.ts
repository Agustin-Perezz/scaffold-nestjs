import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IActualizarReservaRepository } from './actualizar-reserva.repository.interface';
import { ActualizarReservaRequestDto } from './actualizar-reserva.request.dto';
import { ActualizarReservaResponseDto } from './actualizar-reserva.response.dto';
import { ESTADOS_RESERVA } from '../../../../domain/entities/reserva.entity';

@Injectable()
export class ActualizarReservaUseCase {
  constructor(
    @Inject('IActualizarReservaRepository')
    private readonly repository: IActualizarReservaRepository,
  ) {}

  async execute(id: string, dto: ActualizarReservaRequestDto): Promise<ActualizarReservaResponseDto> {
    const reserva = await this.repository.obtenerPorId(id);
    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado === ESTADOS_RESERVA.COMPLETADA || reserva.estado === ESTADOS_RESERVA.CANCELADA) {
      throw new BadRequestException('No se puede modificar una reserva completada o cancelada');
    }

    if (dto.fechaInicio !== undefined && dto.fechaFin !== undefined) {
      const fechaInicio = new Date(dto.fechaInicio);
      const fechaFin = new Date(dto.fechaFin);
      if (fechaInicio >= fechaFin) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
      }
      reserva.actualizarFechasYPrecio(fechaInicio, fechaFin, dto.precioTotal ?? reserva.precioTotal);
    } else if (dto.fechaInicio !== undefined) {
      reserva.actualizarFechasYPrecio(new Date(dto.fechaInicio), reserva.fechaFin, dto.precioTotal ?? reserva.precioTotal);
    } else if (dto.fechaFin !== undefined) {
      reserva.actualizarFechasYPrecio(reserva.fechaInicio, new Date(dto.fechaFin), dto.precioTotal ?? reserva.precioTotal);
    } else if (dto.precioTotal !== undefined) {
      reserva.actualizarFechasYPrecio(reserva.fechaInicio, reserva.fechaFin, dto.precioTotal);
    }

    const reservaActualizada = await this.repository.guardar(reserva);

    return new ActualizarReservaResponseDto({
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
