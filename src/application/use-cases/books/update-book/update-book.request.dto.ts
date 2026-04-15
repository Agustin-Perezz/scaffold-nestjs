import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateBookRequestDto {
  @ApiPropertyOptional({ description: 'Book title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Author name' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Year of publication' })
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(9999)
  publicationYear?: number;

  @ApiPropertyOptional({ description: 'Genre of the book' })
  @IsOptional()
  @IsString()
  genre?: string | null;
}
