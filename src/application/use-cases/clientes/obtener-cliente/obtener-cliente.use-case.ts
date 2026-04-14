import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IObtenerClienteRepository } from './obtener-cliente.repository.interface';
import { ObtenerClienteResponseDto } from './obtener-cliente.response.dto';

@Injectable()
export class ObtenerClienteUseCase {
  constructor(
    @Inject('IObtenerClienteRepository')
    private readonly repository: IObtenerClienteRepository,
  ) {}

  async execute(id: string): Promise<ObtenerClienteResponseDto> {
    const cliente = await this.repository.obtenerPorId(id);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return new ObtenerClienteResponseDto({
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      dni: cliente.dni,
      telefono: cliente.telefono,
      email: cliente.email,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
    });
  }
}
