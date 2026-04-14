import { Inject, Injectable } from '@nestjs/common';
import { IListarClientesRepository } from './listar-clientes.repository.interface';
import { ListarClientesResponseDto, ClienteResponseDto } from './listar-clientes.response.dto';

@Injectable()
export class ListarClientesUseCase {
  constructor(
    @Inject('IListarClientesRepository')
    private readonly repository: IListarClientesRepository,
  ) {}

  async execute(): Promise<ListarClientesResponseDto> {
    const clientes = await this.repository.listarTodos();
    return new ListarClientesResponseDto({
      clientes: clientes.map((cliente) =>
        new ClienteResponseDto({
          id: cliente.id,
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          dni: cliente.dni,
          telefono: cliente.telefono,
          email: cliente.email,
          createdAt: cliente.createdAt,
          updatedAt: cliente.updatedAt,
        }),
      ),
    });
  }
}
