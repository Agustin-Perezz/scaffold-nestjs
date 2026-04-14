import { ApiProperty } from '@nestjs/swagger';

export class ObtenerReservaResponseDto {
  @ApiProperty({ description: 'ID único de la reserva' })
  id: string;

  @ApiProperty({ description: 'ID del auto reservado' })
  autoId: string;

  @ApiProperty({ description: 'ID del cliente que reserva' })
  clienteId: string;

  @ApiProperty({ description: 'Fecha y hora de inicio' })
  fechaInicio: Date;

  @ApiProperty({ description: 'Fecha y hora de fin' })
  fechaFin: Date;

  @ApiProperty({ description: 'Fecha y hora de retorno' })
  fechaRetorno: Date | null;

  @ApiProperty({ description: 'Estado de la reserva' })
  estado: string;

  @ApiProperty({ description: 'Precio total' })
  precioTotal: number;

  @ApiProperty({ description: 'Penalidad' })
  penalidad: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date;

  constructor(partial: Partial<ObtenerReservaResponseDto>) {
    Object.assign(this, partial);
  }
}
