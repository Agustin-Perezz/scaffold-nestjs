import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/postgresql';
import { v7 as uuidv7 } from 'uuid';

@Entity({ tableName: 'clientes' })
export class ClienteEntity {
  @PrimaryKey()
  id: string = uuidv7();

  @Index()
  @Property()
  nombre: string;

  @Property()
  apellido: string;

  @Property({ unique: true })
  dni: string;

  @Property()
  telefono: string;

  @Property({ nullable: true })
  email: string | null = null;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(nombre: string, apellido: string, dni: string, telefono: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.telefono = telefono;
  }
}