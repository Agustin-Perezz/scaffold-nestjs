import { IsDateString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DevolverAutoRequestDto {
  @ApiProperty({ description: 'Fecha y hora de retorno del auto', example: '2024-01-15T15:30:00.000Z' })
  @IsDateString()
  fechaRetorno: string;
}
