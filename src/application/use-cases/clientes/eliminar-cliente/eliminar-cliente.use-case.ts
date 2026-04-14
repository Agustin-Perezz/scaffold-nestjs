import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IEliminarClienteRepository } from './eliminar-cliente.repository.interface';

@Injectable()
export class EliminarClienteUseCase {
  constructor(
    @Inject('IEliminarClienteRepository')
    private readonly repository: IEliminarClienteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const cliente = await this.repository.obtenerPorId(id);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    await this.repository.eliminar(id);
  }
}
