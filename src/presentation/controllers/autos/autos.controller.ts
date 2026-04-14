import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CrearAutoUseCase } from '../../../application/use-cases/autos/crear-auto/crear-auto.use-case';
import { ObtenerAutoUseCase } from '../../../application/use-cases/autos/obtener-auto/obtener-auto.use-case';
import { ListarAutosUseCase } from '../../../application/use-cases/autos/listar-autos/listar-autos.use-case';
import { ActualizarAutoUseCase } from '../../../application/use-cases/autos/actualizar-auto/actualizar-auto.use-case';
import { EliminarAutoUseCase } from '../../../application/use-cases/autos/eliminar-auto/eliminar-auto.use-case';
import { CrearAutoRequestDto } from '../../../application/use-cases/autos/crear-auto/crear-auto.request.dto';
import { ActualizarAutoRequestDto } from '../../../application/use-cases/autos/actualizar-auto/actualizar-auto.request.dto';
import { CrearAutoResponseDto } from '../../../application/use-cases/autos/crear-auto/crear-auto.response.dto';
import { ListarAutosRequestDto } from '../../../application/use-cases/autos/listar-autos/listar-autos.request.dto';

@ApiTags('Autos')
@Controller('autos')
export class AutosController {
  constructor(
    private readonly crearAutoUseCase: CrearAutoUseCase,
    private readonly obtenerAutoUseCase: ObtenerAutoUseCase,
    private readonly listarAutosUseCase: ListarAutosUseCase,
    private readonly actualizarAutoUseCase: ActualizarAutoUseCase,
    private readonly eliminarAutoUseCase: EliminarAutoUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo auto' })
  @ApiResponse({ status: 201, description: 'Auto creado exitosamente', type: CrearAutoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o patente duplicada' })
  async crear(@Body() dto: CrearAutoRequestDto): Promise<CrearAutoResponseDto> {
    return this.crearAutoUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los autos' })
  @ApiResponse({ status: 200, description: 'Lista de autos', type: [CrearAutoResponseDto] })
  async listar(@Body() query: ListarAutosRequestDto): Promise<CrearAutoResponseDto[]> {
    if (query.soloDisponibles) {
      return this.listarAutosUseCase.executeDisponibles();
    }
    return this.listarAutosUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un auto por ID' })
  @ApiParam({ name: 'id', description: 'ID del auto' })
  @ApiResponse({ status: 200, description: 'Auto encontrado', type: CrearAutoResponseDto })
  @ApiResponse({ status: 404, description: 'Auto no encontrado' })
  async obtener(@Param('id') id: string): Promise<CrearAutoResponseDto> {
    return this.obtenerAutoUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un auto' })
  @ApiParam({ name: 'id', description: 'ID del auto' })
  @ApiResponse({ status: 200, description: 'Auto actualizado', type: CrearAutoResponseDto })
  @ApiResponse({ status: 404, description: 'Auto no encontrado' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarAutoRequestDto,
  ): Promise<CrearAutoResponseDto> {
    return this.actualizarAutoUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un auto' })
  @ApiParam({ name: 'id', description: 'ID del auto' })
  @ApiResponse({ status: 204, description: 'Auto eliminado' })
  @ApiResponse({ status: 404, description: 'Auto no encontrado' })
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.eliminarAutoUseCase.execute(id);
  }
}
