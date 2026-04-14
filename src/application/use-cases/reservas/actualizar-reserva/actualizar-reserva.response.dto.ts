import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarReservaResponseDto {
  @ApiPropertyOptional({ description: 'ID único de la reserva' })
  id: string;

  @ApiPropertyOptional({ description: 'ID del auto reservado' })
  autoId: string;

  @ApiPropertyOptional({ description: 'ID del cliente que reserva' })
  clienteId: string;

  @ApiPropertyOptional({ description: 'Fecha y hora de inicio' })
  fechaInicio: Date;

  @ApiPropertyOptional({ description: 'Fecha y hora de fin' })
  fechaFin: Date;

  @ApiPropertyOptional({ description: 'Fecha y hora de retorno' })
  fechaRetorno: Date | null;

  @ApiPropertyOptional({ description: 'Estado de la reserva' })
  estado: string;

  @ApiPropertyOptional({ description: 'Precio total' })
  precioTotal: number;

  @ApiPropertyOptional({ description: 'Penalidad' })
  penalidad: number | null;

  @ApiPropertyOptional({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de actualización' })
  updatedAt: Date;

  constructor(partial: Partial<ActualizarReservaResponseDto>) {
    Object.assign(this, partial);
  }
}
