import { Inject, Injectable } from '@nestjs/common';
import { IListarReservasRepository } from './listar-reservas.repository.interface';
import { ListarReservasResponseDto, ReservaResponseDto } from './listar-reservas.response.dto';

@Injectable()
export class ListarReservasUseCase {
  constructor(
    @Inject('IListarReservasRepository')
    private readonly repository: IListarReservasRepository,
  ) {}

  async execute(): Promise<ListarReservasResponseDto> {
    const reservas = await this.repository.listarTodos();
    return new ListarReservasResponseDto({
      reservas: reservas.map((reserva) =>
        new ReservaResponseDto({
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
        }),
      ),
    });
  }

  async executePorAuto(autoId: string): Promise<ListarReservasResponseDto> {
    const reservas = await this.repository.listarPorAuto(autoId);
    return new ListarReservasResponseDto({
      reservas: reservas.map((reserva) =>
        new ReservaResponseDto({
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
        }),
      ),
    });
  }

  async executePorCliente(clienteId: string): Promise<ListarReservasResponseDto> {
    const reservas = await this.repository.listarPorCliente(clienteId);
    return new ListarReservasResponseDto({
      reservas: reservas.map((reserva) =>
        new ReservaResponseDto({
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
        }),
      ),
    });
  }
}
