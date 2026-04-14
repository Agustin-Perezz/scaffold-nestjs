import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearClienteRequestDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Apellido del cliente', example: 'Pérez' })
  @IsString()
  apellido: string;

  @ApiProperty({ description: 'DNI del cliente (único)', example: '12345678' })
  @IsString()
  dni: string;

  @ApiProperty({ description: 'Teléfono de contacto', example: '+5491123456789' })
  @IsString()
  telefono: string;

  @ApiPropertyOptional({ description: 'Email del cliente (opcional)', example: 'juan.perez@mail.com' })
  @IsOptional()
  @IsEmail()
  email?: string | null;
}
