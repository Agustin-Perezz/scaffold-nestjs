import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class ListarAutosRequestDto {
  @ApiPropertyOptional({ description: 'Filtrar solo autos disponibles' })
  @IsOptional()
  @IsBoolean()
  soloDisponibles?: boolean;
}
