import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CrearClienteUseCase } from '../../../application/use-cases/clientes/crear-cliente/crear-cliente.use-case';
import { ObtenerClienteUseCase } from '../../../application/use-cases/clientes/obtener-cliente/obtener-cliente.use-case';
import { ListarClientesUseCase } from '../../../application/use-cases/clientes/listar-clientes/listar-clientes.use-case';
import { ActualizarClienteUseCase } from '../../../application/use-cases/clientes/actualizar-cliente/actualizar-cliente.use-case';
import { EliminarClienteUseCase } from '../../../application/use-cases/clientes/eliminar-cliente/eliminar-cliente.use-case';
import { CrearClienteRequestDto } from '../../../application/use-cases/clientes/crear-cliente/crear-cliente.request.dto';
import { ActualizarClienteRequestDto } from '../../../application/use-cases/clientes/actualizar-cliente/actualizar-cliente.request.dto';
import { CrearClienteResponseDto } from '../../../application/use-cases/clientes/crear-cliente/crear-cliente.response.dto';
import { ObtenerClienteResponseDto } from '../../../application/use-cases/clientes/obtener-cliente/obtener-cliente.response.dto';
import { ListarClientesResponseDto } from '../../../application/use-cases/clientes/listar-clientes/listar-clientes.response.dto';
import { ActualizarClienteResponseDto } from '../../../application/use-cases/clientes/actualizar-cliente/actualizar-cliente.response.dto';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(
    private readonly crearClienteUseCase: CrearClienteUseCase,
    private readonly obtenerClienteUseCase: ObtenerClienteUseCase,
    private readonly listarClientesUseCase: ListarClientesUseCase,
    private readonly actualizarClienteUseCase: ActualizarClienteUseCase,
    private readonly eliminarClienteUseCase: EliminarClienteUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente', type: CrearClienteResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o DNI duplicado' })
  async crear(@Body() dto: CrearClienteRequestDto): Promise<CrearClienteResponseDto> {
    return this.crearClienteUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes', type: ListarClientesResponseDto })
  async listar(): Promise<ListarClientesResponseDto> {
    return this.listarClientesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado', type: ObtenerClienteResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async obtener(@Param('id') id: string): Promise<ObtenerClienteResponseDto> {
    return this.obtenerClienteUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado', type: ActualizarClienteResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarClienteRequestDto,
  ): Promise<ActualizarClienteResponseDto> {
    return this.actualizarClienteUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 204, description: 'Cliente eliminado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.eliminarClienteUseCase.execute(id);
  }
}
