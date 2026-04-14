import { Entity, PrimaryKey, Property, Index, Enum } from '@mikro-orm/postgresql';
import { v7 as uuidv7 } from 'uuid';

export const ESTADOS_RESERVA = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  EN_CURSO: 'en_curso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
} as const;

@Entity({ tableName: 'reservas' })
export class ReservaEntity {
  @PrimaryKey()
  id: string = uuidv7();

  @Index()
  @Property()
  autoId: string;

  @Index()
  @Property()
  clienteId: string;

  @Property()
  fechaInicio: Date;

  @Property()
  fechaFin: Date;

  @Property({ nullable: true })
  fechaRetorno: Date | null = null;

  @Index()
  @Property()
  estado: string = ESTADOS_RESERVA.PENDIENTE;

  @Property()
  precioTotal: number;

  @Property({ nullable: true })
  penalidad: number | null = null;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(autoId: string, clienteId: string, fechaInicio: Date, fechaFin: Date, precioTotal: number) {
    this.autoId = autoId;
    this.clienteId = clienteId;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.precioTotal = precioTotal;
  }
}