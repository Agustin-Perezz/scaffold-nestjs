import { ApiProperty } from '@nestjs/swagger';

export class ObtenerClienteResponseDto {
  @ApiProperty({ description: 'ID único del cliente' })
  id: string;

  @ApiProperty({ description: 'Nombre del cliente' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del cliente' })
  apellido: string;

  @ApiProperty({ description: 'DNI del cliente' })
  dni: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  telefono: string;

  @ApiProperty({ description: 'Email del cliente' })
  email: string | null;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  constructor(partial: Partial<ObtenerClienteResponseDto>) {
    Object.assign(this, partial);
  }
}
