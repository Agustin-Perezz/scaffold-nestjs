import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateBookRequestDto } from '../../../application/use-cases/books/create-book/create-book.request.dto';
import { CreateBookResponseDto } from '../../../application/use-cases/books/create-book/create-book.response.dto';
import { CreateBookUseCase } from '../../../application/use-cases/books/create-book/create-book.use-case';
import { DeleteBookUseCase } from '../../../application/use-cases/books/delete-book/delete-book.use-case';
import { GetBookResponseDto } from '../../../application/use-cases/books/get-book/get-book.response.dto';
import { GetBookUseCase } from '../../../application/use-cases/books/get-book/get-book.use-case';
import { ListBooksResponseDto } from '../../../application/use-cases/books/list-books/list-books.response.dto';
import { ListBooksUseCase } from '../../../application/use-cases/books/list-books/list-books.use-case';
import { UpdateBookRequestDto } from '../../../application/use-cases/books/update-book/update-book.request.dto';
import { UpdateBookResponseDto } from '../../../application/use-cases/books/update-book/update-book.response.dto';
import { UpdateBookUseCase } from '../../../application/use-cases/books/update-book/update-book.use-case';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly getBookUseCase: GetBookUseCase,
    private readonly listBooksUseCase: ListBooksUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
    type: CreateBookResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data or duplicate ISBN' })
  async create(@Body() dto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
    return this.createBookUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all books' })
  @ApiResponse({ status: 200, description: 'List of books', type: ListBooksResponseDto })
  async list(): Promise<ListBooksResponseDto> {
    return this.listBooksUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book found', type: GetBookResponseDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async get(@Param('id') id: string): Promise<GetBookResponseDto> {
    return this.getBookUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book updated', type: UpdateBookResponseDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookRequestDto,
  ): Promise<UpdateBookResponseDto> {
    return this.updateBookUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 204, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteBookUseCase.execute(id);
  }
}
