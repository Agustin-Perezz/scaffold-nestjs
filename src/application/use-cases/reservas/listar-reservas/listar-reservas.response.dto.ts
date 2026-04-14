import { ApiProperty } from '@nestjs/swagger';

export class ReservaResponseDto {
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

  constructor(partial: Partial<ReservaResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListarReservasResponseDto {
  @ApiProperty({ type: [ReservaResponseDto], description: 'Lista de reservas' })
  reservas: ReservaResponseDto[];

  constructor(partial: Partial<ListarReservasResponseDto>) {
    Object.assign(this, partial);
  }
}
