import { v7 as uuidv7 } from 'uuid';

export interface ClienteProperties {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearClienteParams {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email?: string | null;
}

export interface ReconstructClienteParams {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Cliente {
  private readonly _id: string;
  private _nombre: string;
  private _apellido: string;
  private readonly _dni: string;
  private _telefono: string;
  private _email: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ClienteProperties) {
    this._id = props.id;
    this._nombre = props.nombre;
    this._apellido = props.apellido;
    this._dni = props.dni;
    this._telefono = props.telefono;
    this._email = props.email;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(params: CrearClienteParams): Cliente {
    const now = new Date();
    return new Cliente({
      id: uuidv7(),
      nombre: params.nombre,
      apellido: params.apellido,
      dni: params.dni,
      telefono: params.telefono,
      email: params.email ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstruct(params: ReconstructClienteParams): Cliente {
    return new Cliente({
      id: params.id,
      nombre: params.nombre,
      apellido: params.apellido,
      dni: params.dni,
      telefono: params.telefono,
      email: params.email,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  }

  get id(): string {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get apellido(): string {
    return this._apellido;
  }

  get dni(): string {
    return this._dni;
  }

  get telefono(): string {
    return this._telefono;
  }

  get email(): string | null {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  actualizarContacto(telefono: string, email?: string | null): void {
    this._telefono = telefono;
    if (email !== undefined) {
      this._email = email;
    }
    this._updatedAt = new Date();
  }

  actualizarEmail(email: string | null): void {
    this._email = email;
    this._updatedAt = new Date();
  }

  actualizarNombre(nombre: string): void {
    this._nombre = nombre;
    this._updatedAt = new Date();
  }

  actualizarApellido(apellido: string): void {
    this._apellido = apellido;
    this._updatedAt = new Date();
  }
}
