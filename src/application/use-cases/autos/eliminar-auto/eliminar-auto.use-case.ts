import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IEliminarAutoRepository } from './eliminar-auto.repository.interface';

@Injectable()
export class EliminarAutoUseCase {
  constructor(
    @Inject('IEliminarAutoRepository')
    private readonly repository: IEliminarAutoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const auto = await this.repository.obtenerPorId(id);
    if (!auto) {
      throw new NotFoundException('Auto no encontrado');
    }
    await this.repository.eliminar(id);
  }
}
