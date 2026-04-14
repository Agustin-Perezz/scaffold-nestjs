import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Reserva } from '../../../../domain/entities/reserva.entity';
import { ICrearReservaRepository } from './crear-reserva.repository.interface';
import { CrearReservaRequestDto } from './crear-reserva.request.dto';
import { CrearReservaResponseDto } from './crear-reserva.response.dto';

@Injectable()
export class CrearReservaUseCase {
  constructor(
    @Inject('ICrearReservaRepository')
    private readonly repository: ICrearReservaRepository,
  ) {}

  async execute(dto: CrearReservaRequestDto): Promise<CrearReservaResponseDto> {
    const auto = await this.repository.obtenerAutoPorId(dto.autoId);
    if (!auto) {
      throw new NotFoundException('Auto no encontrado');
    }

    if (!auto.disponible) {
      throw new BadRequestException('El auto no está disponible');
    }

    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFin = new Date(dto.fechaFin);

    if (fechaInicio >= fechaFin) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    const tieneSolapamiento = await this.repository.tieneReservasSolapadas(
      dto.autoId,
      fechaInicio,
      fechaFin,
    );

    if (tieneSolapamiento) {
      throw new BadRequestException('El auto ya tiene una reserva que se solapa con esas fechas');
    }

    const reserva = Reserva.create({
      autoId: dto.autoId,
      clienteId: dto.clienteId,
      fechaInicio,
      fechaFin,
      precioTotal: dto.precioTotal,
    });

    const reservaCreada = await this.repository.crear(reserva);

    return new CrearReservaResponseDto({
      id: reservaCreada.id,
      autoId: reservaCreada.autoId,
      clienteId: reservaCreada.clienteId,
      fechaInicio: reservaCreada.fechaInicio,
      fechaFin: reservaCreada.fechaFin,
      fechaRetorno: reservaCreada.fechaRetorno,
      estado: reservaCreada.estado,
      precioTotal: reservaCreada.precioTotal,
      penalidad: reservaCreada.penalidad,
      createdAt: reservaCreada.createdAt,
      updatedAt: reservaCreada.updatedAt,
    });
  }
}
