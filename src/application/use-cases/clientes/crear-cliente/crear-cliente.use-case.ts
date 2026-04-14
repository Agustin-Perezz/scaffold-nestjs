import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Cliente } from '../../../../domain/entities/cliente.entity';
import { ICrearClienteRepository } from './crear-cliente.repository.interface';
import { CrearClienteRequestDto } from './crear-cliente.request.dto';
import { CrearClienteResponseDto } from './crear-cliente.response.dto';

@Injectable()
export class CrearClienteUseCase {
  constructor(
    @Inject('ICrearClienteRepository')
    private readonly repository: ICrearClienteRepository,
  ) {}

  async execute(dto: CrearClienteRequestDto): Promise<CrearClienteResponseDto> {
    const existeDni = await this.repository.existePorDni(dto.dni);
    if (existeDni) {
      throw new BadRequestException('Ya existe un cliente con ese DNI');
    }

    const cliente = Cliente.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      dni: dto.dni,
      telefono: dto.telefono,
      email: dto.email,
    });

    const clienteCreado = await this.repository.crear(cliente);

    return new CrearClienteResponseDto({
      id: clienteCreado.id,
      nombre: clienteCreado.nombre,
      apellido: clienteCreado.apellido,
      dni: clienteCreado.dni,
      telefono: clienteCreado.telefono,
      email: clienteCreado.email,
      createdAt: clienteCreado.createdAt,
      updatedAt: clienteCreado.updatedAt,
    });
  }
}
