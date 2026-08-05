import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationRequestDto } from '../../../application/shared/dtos/pagination.request.dto';
import { CreateAuthorRequestDto } from '../../../application/use-cases/authors/create-author/create-author.request.dto';
import { CreateAuthorResponseDto } from '../../../application/use-cases/authors/create-author/create-author.response.dto';
import { CreateAuthorUseCase } from '../../../application/use-cases/authors/create-author/create-author.use-case';
import { ListBooksByAuthorResponseDto } from '../../../application/use-cases/authors/list-books-by-author/list-books-by-author.response.dto';
import { ListBooksByAuthorUseCase } from '../../../application/use-cases/authors/list-books-by-author/list-books-by-author.use-case';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly listBooksByAuthorUseCase: ListBooksByAuthorUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({
    status: 201,
    description: 'Author created successfully',
    type: CreateAuthorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() dto: CreateAuthorRequestDto): Promise<CreateAuthorResponseDto> {
    return this.createAuthorUseCase.execute(dto);
  }

  @Get(':id/books')
  @ApiOperation({ summary: 'List books by author' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({
    status: 200,
    description: 'Author and their books',
    type: ListBooksByAuthorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async listBooks(
    @Param('id') id: string,
    @Query() pagination: PaginationRequestDto,
  ): Promise<ListBooksByAuthorResponseDto> {
    return this.listBooksByAuthorUseCase.execute(id, pagination);
  }
}
