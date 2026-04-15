import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetBookResponseDto {
    @ApiProperty({ description: 'Book unique ID' })
    id: string;

    @ApiProperty({ description: 'Book title' })
    title: string;

    @ApiProperty({ description: 'Author name' })
    author: string;

    @ApiProperty({ description: 'ISBN' })
    isbn: string;

    @ApiProperty({ description: 'Year of publication' })
    publicationYear: number;

    @ApiPropertyOptional({ description: 'Genre of the book' })
    genre: string | null;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<GetBookResponseDto>) {
        Object.assign(this, partial);
    }
}
