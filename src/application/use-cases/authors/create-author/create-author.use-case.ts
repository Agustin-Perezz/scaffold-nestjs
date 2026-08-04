import { Inject, Injectable } from '@nestjs/common';

import { Author } from '../../../../domain/entities/author.entity';
import { ICreateAuthorRepository } from './create-author.repository.interface';
import { CreateAuthorRequestDto } from './create-author.request.dto';
import { CreateAuthorResponseDto } from './create-author.response.dto';

@Injectable()
export class CreateAuthorUseCase {
  constructor(
    @Inject('ICreateAuthorRepository')
    private readonly repository: ICreateAuthorRepository,
  ) {}

  async execute(dto: CreateAuthorRequestDto): Promise<CreateAuthorResponseDto> {
    const author = Author.create({ name: dto.name });

    const created = await this.repository.create(author);

    return new CreateAuthorResponseDto({
      id: created.id,
      name: created.name,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
