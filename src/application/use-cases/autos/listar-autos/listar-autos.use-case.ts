import { Inject, Injectable } from '@nestjs/common';
import { IListarAutosRepository } from './listar-autos.repository.interface';

export class ListarAutosResponseDto {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  patente: string;
  precioPorHora: number;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ListarAutosResponseDto>) {
    Object.assign(this, partial);
  }
}

@Injectable()
export class ListarAutosUseCase {
  constructor(
    @Inject('IListarAutosRepository')
    private readonly repository: IListarAutosRepository,
  ) {}

  async execute(): Promise<ListarAutosResponseDto[]> {
    const autos = await this.repository.listarTodos();
    return autos.map((auto) =>
      new ListarAutosResponseDto({
        id: auto.id,
        marca: auto.marca,
        modelo: auto.modelo,
        anio: auto.anio,
        patente: auto.patente,
        precioPorHora: auto.precioPorHora,
        disponible: auto.disponible,
        createdAt: auto.createdAt,
        updatedAt: auto.updatedAt,
      }),
    );
  }

  async executeDisponibles(): Promise<ListarAutosResponseDto[]> {
    const autos = await this.repository.listarDisponibles();
    return autos.map((auto) =>
      new ListarAutosResponseDto({
        id: auto.id,
        marca: auto.marca,
        modelo: auto.modelo,
        anio: auto.anio,
        patente: auto.patente,
        precioPorHora: auto.precioPorHora,
        disponible: auto.disponible,
        createdAt: auto.createdAt,
        updatedAt: auto.updatedAt,
      }),
    );
  }
}
