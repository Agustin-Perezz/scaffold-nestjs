import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateBookRequestDto {
  @ApiProperty({
    description: 'Book title',
    example: 'The Pragmatic Programmer',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Author ID', example: '0193b1a0-0000-7bbb-8bbb-000000000001' })
  @IsUUID()
  authorId: string;

  @ApiProperty({ description: 'ISBN (unique)', example: '978-0135957059' })
  @IsString()
  isbn: string;

  @ApiProperty({ description: 'Year of publication', example: 1999 })
  @IsInt()
  @Min(1000)
  @Max(9999)
  publicationYear: number;

  @ApiPropertyOptional({
    description: 'Genre of the book',
    example: 'Software Engineering',
  })
  @IsOptional()
  @IsString()
  genre?: string | null;
}
