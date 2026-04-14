import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CrearReservaUseCase } from '../../../application/use-cases/reservas/crear-reserva/crear-reserva.use-case';
import { ObtenerReservaUseCase } from '../../../application/use-cases/reservas/obtener-reserva/obtener-reserva.use-case';
import { ListarReservasUseCase } from '../../../application/use-cases/reservas/listar-reservas/listar-reservas.use-case';
import { ActualizarReservaUseCase } from '../../../application/use-cases/reservas/actualizar-reserva/actualizar-reserva.use-case';
import { EliminarReservaUseCase } from '../../../application/use-cases/reservas/eliminar-reserva/eliminar-reserva.use-case';
import { DevolverAutoUseCase } from '../../../application/use-cases/reservas/devolver-auto/devolver-auto.use-case';
import { ConfirmarReservaUseCase } from '../../../application/use-cases/reservas/confirmar-reserva/confirmar-reserva.use-case';
import { IniciarReservaUseCase } from '../../../application/use-cases/reservas/iniciar-reserva/iniciar-reserva.use-case';
import { CancelarReservaUseCase } from '../../../application/use-cases/reservas/cancelar-reserva/cancelar-reserva.use-case';
import { CrearReservaRequestDto } from '../../../application/use-cases/reservas/crear-reserva/crear-reserva.request.dto';
import { ActualizarReservaRequestDto } from '../../../application/use-cases/reservas/actualizar-reserva/actualizar-reserva.request.dto';
import { DevolverAutoRequestDto } from '../../../application/use-cases/reservas/devolver-auto/devolver-auto.request.dto';
import { CrearReservaResponseDto } from '../../../application/use-cases/reservas/crear-reserva/crear-reserva.response.dto';
import { ObtenerReservaResponseDto } from '../../../application/use-cases/reservas/obtener-reserva/obtener-reserva.response.dto';
import { ListarReservasResponseDto } from '../../../application/use-cases/reservas/listar-reservas/listar-reservas.response.dto';
import { ActualizarReservaResponseDto } from '../../../application/use-cases/reservas/actualizar-reserva/actualizar-reserva.response.dto';
import { DevolverAutoResponseDto } from '../../../application/use-cases/reservas/devolver-auto/devolver-auto.response.dto';
import { ConfirmarReservaResponseDto } from '../../../application/use-cases/reservas/confirmar-reserva/confirmar-reserva.response.dto';
import { IniciarReservaResponseDto } from '../../../application/use-cases/reservas/iniciar-reserva/iniciar-reserva.response.dto';
import { CancelarReservaResponseDto } from '../../../application/use-cases/reservas/cancelar-reserva/cancelar-reserva.response.dto';

@ApiTags('Reservas')
@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly crearReservaUseCase: CrearReservaUseCase,
    private readonly obtenerReservaUseCase: ObtenerReservaUseCase,
    private readonly listarReservasUseCase: ListarReservasUseCase,
    private readonly actualizarReservaUseCase: ActualizarReservaUseCase,
    private readonly eliminarReservaUseCase: EliminarReservaUseCase,
    private readonly devolverAutoUseCase: DevolverAutoUseCase,
    private readonly confirmarReservaUseCase: ConfirmarReservaUseCase,
    private readonly iniciarReservaUseCase: IniciarReservaUseCase,
    private readonly cancelarReservaUseCase: CancelarReservaUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente', type: CrearReservaResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o auto no disponible' })
  async crear(@Body() dto: CrearReservaRequestDto): Promise<CrearReservaResponseDto> {
    return this.crearReservaUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las reservas' })
  @ApiResponse({ status: 200, description: 'Lista de reservas', type: ListarReservasResponseDto })
  async listar(
    @Query('autoId') autoId?: string,
    @Query('clienteId') clienteId?: string,
  ): Promise<ListarReservasResponseDto> {
    if (autoId) {
      return this.listarReservasUseCase.executePorAuto(autoId);
    }
    if (clienteId) {
      return this.listarReservasUseCase.executePorCliente(clienteId);
    }
    return this.listarReservasUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada', type: CrearReservaResponseDto })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async obtener(@Param('id') id: string): Promise<ObtenerReservaResponseDto> {
    return this.obtenerReservaUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una reserva' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva actualizada', type: CrearReservaResponseDto })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarReservaRequestDto,
  ): Promise<ObtenerReservaResponseDto> {
    return this.actualizarReservaUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una reserva' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 204, description: 'Reserva eliminada' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.eliminarReservaUseCase.execute(id);
  }

  @Post(':id/confirmar')
  @ApiOperation({ summary: 'Confirmar una reserva pendiente' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva confirmada', type: ConfirmarReservaResponseDto })
  @ApiResponse({ status: 400, description: 'La reserva no está pendiente' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async confirmar(@Param('id') id: string): Promise<ConfirmarReservaResponseDto> {
    return this.confirmarReservaUseCase.execute(id);
  }

  @Post(':id/iniciar')
  @ApiOperation({ summary: 'Iniciar una reserva confirmada' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva iniciada', type: IniciarReservaResponseDto })
  @ApiResponse({ status: 400, description: 'La reserva no está confirmada' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async iniciar(@Param('id') id: string): Promise<IniciarReservaResponseDto> {
    return this.iniciarReservaUseCase.execute(id);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar una reserva pendiente o confirmada' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada', type: CancelarReservaResponseDto })
  @ApiResponse({ status: 400, description: 'La reserva no puede cancelarse' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async cancelar(@Param('id') id: string): Promise<CancelarReservaResponseDto> {
    return this.cancelarReservaUseCase.execute(id);
  }

  @Post(':id/devolver')
  @ApiOperation({ summary: 'Registrar la devolución de un auto' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Devolución registrada', type: DevolverAutoResponseDto })
  @ApiResponse({ status: 400, description: 'La reserva no está en curso' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async devolver(
    @Param('id') id: string,
    @Body() dto: DevolverAutoRequestDto,
  ): Promise<DevolverAutoResponseDto> {
    return this.devolverAutoUseCase.execute(id, dto);
  }
}
