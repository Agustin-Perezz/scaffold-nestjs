import { ApiProperty } from '@nestjs/swagger';

export class DevolverAutoResponseDto {
  @ApiProperty({ description: 'ID único de la reserva' })
  id: string;

  @ApiProperty({ description: 'ID del auto' })
  autoId: string;

  @ApiProperty({ description: 'ID del cliente' })
  clienteId: string;

  @ApiProperty({ description: 'Fecha de inicio de la reserva' })
  fechaInicio: Date;

  @ApiProperty({ description: 'Fecha de fin de la reserva' })
  fechaFin: Date;

  @ApiProperty({ description: 'Fecha de retorno del auto' })
  fechaRetorno: Date | null;

  @ApiProperty({ description: 'Estado actual de la reserva' })
  estado: string;

  @ApiProperty({ description: 'Precio total de la reserva' })
  precioTotal: number;

  @ApiProperty({ description: 'Penalidad aplicada si corresponde' })
  penalidad: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  constructor(partial: Partial<DevolverAutoResponseDto>) {
    Object.assign(this, partial);
  }
}
