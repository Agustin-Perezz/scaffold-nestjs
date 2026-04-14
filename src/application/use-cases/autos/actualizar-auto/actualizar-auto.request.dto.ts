import { IsOptional, IsString, IsNumber, IsPositive, Min, Max, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarAutoRequestDto {
  @ApiPropertyOptional({ description: 'Marca del auto' })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiPropertyOptional({ description: 'Modelo del auto' })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiPropertyOptional({ description: 'Año del auto' })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  anio?: number;

  @ApiPropertyOptional({ description: 'Patente del auto' })
  @IsOptional()
  @IsString()
  patente?: string;

  @ApiPropertyOptional({ description: 'Precio por hora' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  precioPorHora?: number;

  @ApiPropertyOptional({ description: 'Disponibilidad del auto' })
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
}
