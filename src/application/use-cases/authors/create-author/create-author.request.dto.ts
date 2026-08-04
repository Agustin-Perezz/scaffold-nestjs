import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAuthorRequestDto {
  @ApiProperty({ description: 'Author name', example: 'Andrew Hunt' })
  @IsString()
  name: string;
}
