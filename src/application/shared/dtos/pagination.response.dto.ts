import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic pagination metadata. Extend this class and add the domain
 * collection (e.g. `books: BookResponseDto[]`). Keeps `total`, `limit`,
 * and `offset` consistent across all list endpoints without leaking a
 * generic `items` field into the API response.
 */
export class PaginationResponseDto {
  @ApiProperty({ description: 'Total items matching the query' })
  total: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Items skipped' })
  offset: number;

  constructor(partial: Partial<PaginationResponseDto>) {
    Object.assign(this, partial);
  }
}
