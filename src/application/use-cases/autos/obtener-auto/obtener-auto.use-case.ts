import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IObtenerAutoRepository } from './obtener-auto.repository.interface';
import { ObtenerAutoResponseDto } from './obtener-auto.response.dto';

@Injectable()
export class ObtenerAutoUseCase {
  constructor(
    @Inject('IObtenerAutoRepository')
    private readonly repository: IObtenerAutoRepository,
  ) {}

  async execute(id: string): Promise<ObtenerAutoResponseDto> {
    const auto = await this.repository.obtenerPorId(id);
    if (!auto) {
      throw new NotFoundException('Auto no encontrado');
    }

    return new ObtenerAutoResponseDto({
      id: auto.id,
      marca: auto.marca,
      modelo: auto.modelo,
      anio: auto.anio,
      patente: auto.patente,
      precioPorHora: auto.precioPorHora,
      disponible: auto.disponible,
      createdAt: auto.createdAt,
      updatedAt: auto.updatedAt,
    });
  }
}
