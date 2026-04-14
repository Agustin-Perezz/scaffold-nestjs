import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IActualizarClienteRepository } from './actualizar-cliente.repository.interface';
import { ActualizarClienteRequestDto } from './actualizar-cliente.request.dto';
import { ActualizarClienteResponseDto } from './actualizar-cliente.response.dto';

@Injectable()
export class ActualizarClienteUseCase {
  constructor(
    @Inject('IActualizarClienteRepository')
    private readonly repository: IActualizarClienteRepository,
  ) {}

  async execute(id: string, dto: ActualizarClienteRequestDto): Promise<ActualizarClienteResponseDto> {
    const cliente = await this.repository.obtenerPorId(id);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (dto.dni) {
      const existeDni = await this.repository.existePorDni(dto.dni, id);
      if (existeDni) {
        throw new BadRequestException('Ya existe un cliente con ese DNI');
      }
    }

    if (dto.nombre !== undefined || dto.apellido !== undefined || dto.telefono !== undefined || dto.email !== undefined) {
      if (dto.nombre !== undefined) {
        cliente.actualizarNombre(dto.nombre);
      }
      if (dto.apellido !== undefined) {
        cliente.actualizarApellido(dto.apellido);
      }
      cliente.actualizarContacto(
        dto.telefono ?? cliente.telefono,
        dto.email ?? cliente.email,
      );
    }

    const clienteActualizado = await this.repository.guardar(cliente);

    return new ActualizarClienteResponseDto({
      id: clienteActualizado.id,
      nombre: clienteActualizado.nombre,
      apellido: clienteActualizado.apellido,
      dni: clienteActualizado.dni,
      telefono: clienteActualizado.telefono,
      email: clienteActualizado.email,
      createdAt: clienteActualizado.createdAt,
      updatedAt: clienteActualizado.updatedAt,
    });
  }
}
