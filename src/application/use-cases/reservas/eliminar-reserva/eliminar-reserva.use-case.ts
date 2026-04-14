import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IEliminarReservaRepository } from './eliminar-reserva.repository.interface';
import { ESTADOS_RESERVA } from '../../../../domain/entities/reserva.entity';

@Injectable()
export class EliminarReservaUseCase {
  constructor(
    @Inject('IEliminarReservaRepository')
    private readonly repository: IEliminarReservaRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const reserva = await this.repository.obtenerPorId(id);
    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado === ESTADOS_RESERVA.EN_CURSO) {
      throw new BadRequestException('No se puede eliminar una reserva en curso');
    }

    await this.repository.eliminar(id);
  }
}
