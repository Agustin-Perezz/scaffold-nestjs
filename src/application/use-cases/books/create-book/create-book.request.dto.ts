import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBookRequestDto {
    @ApiProperty({ description: 'Book title', example: 'The Pragmatic Programmer' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Author name', example: 'Andrew Hunt' })
    @IsString()
    author: string;

    @ApiProperty({ description: 'ISBN (unique)', example: '978-0135957059' })
    @IsString()
    isbn: string;

    @ApiProperty({ description: 'Year of publication', example: 1999 })
    @IsInt()
    @Min(1000)
    @Max(9999)
    publicationYear: number;

    @ApiPropertyOptional({ description: 'Genre of the book', example: 'Software Engineering' })
    @IsOptional()
    @IsString()
    genre?: string | null;
}
