import { ApiProperty } from '@nestjs/swagger';

export class ActualizarAutoResponseDto {
  @ApiProperty({ description: 'ID único del auto' })
  id: string;

  @ApiProperty({ description: 'Marca del auto' })
  marca: string;

  @ApiProperty({ description: 'Modelo del auto' })
  modelo: string;

  @ApiProperty({ description: 'Año del auto' })
  anio: number;

  @ApiProperty({ description: 'Patente del auto' })
  patente: string;

  @ApiProperty({ description: 'Precio por hora' })
  precioPorHora: number;

  @ApiProperty({ description: 'Disponibilidad del auto' })
  disponible: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  constructor(partial: Partial<ActualizarAutoResponseDto>) {
    Object.assign(this, partial);
  }
}
