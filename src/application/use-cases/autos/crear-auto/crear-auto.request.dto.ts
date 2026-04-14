import { IsString, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearAutoRequestDto {
  @ApiProperty({ description: 'Marca del auto', example: 'Toyota' })
  @IsString()
  marca: string;

  @ApiProperty({ description: 'Modelo del auto', example: 'Corolla' })
  @IsString()
  modelo: string;

  @ApiProperty({ description: 'Año del auto', example: 2024 })
  @IsNumber()
  @Min(1900)
  @Max(2100)
  anio: number;

  @ApiProperty({ description: 'Patente del auto (única)', example: 'ABC123' })
  @IsString()
  patente: string;

  @ApiProperty({ description: 'Precio por hora de alquiler', example: 1500 })
  @IsNumber()
  @IsPositive()
  precioPorHora: number;
}
