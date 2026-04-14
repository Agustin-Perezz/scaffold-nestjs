import { IsString, IsOptional, IsDateString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarReservaRequestDto {
  @ApiPropertyOptional({ description: 'Fecha y hora de inicio' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha y hora de fin' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'Precio total' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  precioTotal?: number;
}
