import { ApiProperty } from '@nestjs/swagger';

export class CrearReservaResponseDto {
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

  @ApiProperty({ description: 'Fecha y hora de retorno (null si no fue devuelto)' })
  fechaRetorno: Date | null;

  @ApiProperty({ description: 'Estado de la reserva', enum: ['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'] })
  estado: string;

  @ApiProperty({ description: 'Precio total de la reserva' })
  precioTotal: number;

  @ApiProperty({ description: 'Penalidad aplicada (null si no hay)' })
  penalidad: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  constructor(partial: Partial<CrearReservaResponseDto>) {
    Object.assign(this, partial);
  }
}
