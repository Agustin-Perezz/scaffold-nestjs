import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorResponseDto {
  @ApiProperty({ description: 'Author unique ID' })
  id: string;

  @ApiProperty({ description: 'Author name' })
  name: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<CreateAuthorResponseDto>) {
    Object.assign(this, partial);
  }
}
