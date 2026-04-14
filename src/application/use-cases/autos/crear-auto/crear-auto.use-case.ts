import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Auto } from '../../../../domain/entities/auto.entity';
import { ICrearAutoRepository } from './crear-auto.repository.interface';
import { CrearAutoRequestDto } from './crear-auto.request.dto';
import { CrearAutoResponseDto } from './crear-auto.response.dto';

@Injectable()
export class CrearAutoUseCase {
  constructor(
    @Inject('ICrearAutoRepository')
    private readonly repository: ICrearAutoRepository,
  ) {}

  async execute(dto: CrearAutoRequestDto): Promise<CrearAutoResponseDto> {
    const existePatente = await this.repository.existePorPatente(dto.patente);
    if (existePatente) {
      throw new BadRequestException('Ya existe un auto con esa patente');
    }

    const auto = Auto.create({
      marca: dto.marca,
      modelo: dto.modelo,
      anio: dto.anio,
      patente: dto.patente,
      precioPorHora: dto.precioPorHora,
    });

    const autoCreado = await this.repository.crear(auto);

    return new CrearAutoResponseDto({
      id: autoCreado.id,
      marca: autoCreado.marca,
      modelo: autoCreado.modelo,
      anio: autoCreado.anio,
      patente: autoCreado.patente,
      precioPorHora: autoCreado.precioPorHora,
      disponible: autoCreado.disponible,
      createdAt: autoCreado.createdAt,
      updatedAt: autoCreado.updatedAt,
    });
  }
}
