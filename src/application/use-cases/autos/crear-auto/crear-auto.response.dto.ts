import { ApiProperty } from '@nestjs/swagger';

export class CrearAutoResponseDto {
  @ApiProperty({ description: 'ID único del auto', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Marca del auto', example: 'Toyota' })
  marca: string;

  @ApiProperty({ description: 'Modelo del auto', example: 'Corolla' })
  modelo: string;

  @ApiProperty({ description: 'Año del auto', example: 2024 })
  anio: number;

  @ApiProperty({ description: 'Patente del auto', example: 'ABC123' })
  patente: string;

  @ApiProperty({ description: 'Precio por hora', example: 1500 })
  precioPorHora: number;

  @ApiProperty({ description: 'Disponibilidad del auto', example: true })
  disponible: boolean;

  @ApiProperty({ description: 'Fecha de creación', example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<CrearAutoResponseDto>) {
    Object.assign(this, partial);
  }
}
