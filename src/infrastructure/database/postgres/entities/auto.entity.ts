import { Entity, Property, PrimaryKey, Index } from '@mikro-orm/postgresql';
import { v7 as uuidv7 } from 'uuid';

@Entity({ tableName: 'autos' })
export class AutoEntity {
  @PrimaryKey()
  id: string = uuidv7();

  @Index()
  @Property()
  marca: string;

  @Property()
  modelo: string;

  @Property()
  anio: number;

  @Property({ unique: true })
  patente: string;

  @Property()
  precioPorHora: number;

  @Property()
  disponible: boolean = true;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(marca: string, modelo: string, anio: number, patente: string, precioPorHora: number) {
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.patente = patente;
    this.precioPorHora = precioPorHora;
  }
}