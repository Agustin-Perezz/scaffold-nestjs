import { v7 as uuidv7 } from 'uuid';

export interface AutoProperties {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  patente: string;
  precioPorHora: number;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearAutoParams {
  marca: string;
  modelo: string;
  anio: number;
  patente: string;
  precioPorHora: number;
}

export interface ReconstructAutoParams {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  patente: string;
  precioPorHora: number;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Auto {
  private readonly _id: string;
  private _marca: string;
  private _modelo: string;
  private _anio: number;
  private _patente: string;
  private _precioPorHora: number;
  private _disponible: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: AutoProperties) {
    this._id = props.id;
    this._marca = props.marca;
    this._modelo = props.modelo;
    this._anio = props.anio;
    this._patente = props.patente;
    this._precioPorHora = props.precioPorHora;
    this._disponible = props.disponible;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(params: CrearAutoParams): Auto {
    const now = new Date();
    return new Auto({
      id: uuidv7(),
      marca: params.marca,
      modelo: params.modelo,
      anio: params.anio,
      patente: params.patente,
      precioPorHora: params.precioPorHora,
      disponible: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstruct(params: ReconstructAutoParams): Auto {
    return new Auto({
      id: params.id,
      marca: params.marca,
      modelo: params.modelo,
      anio: params.anio,
      patente: params.patente,
      precioPorHora: params.precioPorHora,
      disponible: params.disponible,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  }

  get id(): string {
    return this._id;
  }

  get marca(): string {
    return this._marca;
  }

  get modelo(): string {
    return this._modelo;
  }

  get anio(): number {
    return this._anio;
  }

  get patente(): string {
    return this._patente;
  }

  get precioPorHora(): number {
    return this._precioPorHora;
  }

  get disponible(): boolean {
    return this._disponible;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  activar(): void {
    this._disponible = true;
    this._updatedAt = new Date();
  }

  desactivar(): void {
    this._disponible = false;
    this._updatedAt = new Date();
  }

  actualizarPrecio(precio: number): void {
    if (precio <= 0) {
      throw new Error('El precio por hora debe ser mayor a cero');
    }
    this._precioPorHora = precio;
    this._updatedAt = new Date();
  }

  actualizarMarcaYModelo(marca: string, modelo: string): void {
    this._marca = marca;
    this._modelo = modelo;
    this._updatedAt = new Date();
  }

  actualizarAnio(anio: number): void {
    this._anio = anio;
    this._updatedAt = new Date();
  }
}
