import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarClienteRequestDto {
  @ApiPropertyOptional({ description: 'Nombre del cliente' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Apellido del cliente' })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiPropertyOptional({ description: 'DNI del cliente' })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ description: 'Email del cliente' })
  @IsOptional()
  @IsEmail()
  email?: string | null;
}
