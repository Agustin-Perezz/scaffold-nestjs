import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearReservaRequestDto {
  @ApiProperty({ description: 'ID del auto a reservar' })
  @IsString()
  autoId: string;

  @ApiProperty({ description: 'ID del cliente que reserva' })
  @IsString()
  clienteId: string;

  @ApiProperty({ description: 'Fecha y hora de inicio de la reserva', example: '2024-01-15T10:00:00.000Z' })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({ description: 'Fecha y hora de fin de la reserva', example: '2024-01-15T14:00:00.000Z' })
  @IsDateString()
  fechaFin: string;

  @ApiProperty({ description: 'Precio total de la reserva', example: 6000 })
  @IsNumber()
  @IsPositive()
  precioTotal: number;
}
