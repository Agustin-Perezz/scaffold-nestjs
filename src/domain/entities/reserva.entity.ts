import {v7 as uuidv7} from 'uuid';
import { maquinaEstadosReserva, EventoReserva } from './reserva.state-machine';

export const ESTADOS_RESERVA = {
    PENDIENTE: 'pendiente',
    CONFIRMADA: 'confirmada',
    EN_CURSO: 'en_curso',
    COMPLETADA: 'completada',
    CANCELADA: 'cancelada',
} as const;

export type EstadoReserva = (typeof ESTADOS_RESERVA)[keyof typeof ESTADOS_RESERVA];

export const PENALIDAD = {
    TOLERANCIA_MINUTOS: 15,
    MULTIPLICADOR: 1.2,
} as const;

export const TIEMPO = {
    MILISEGUNDOS_POR_SEGUNDO: 1000,
    SEGUNDOS_POR_MINUTO: 60,
    MINUTOS_POR_HORA: 60,
} as const;

export interface ReservaProperties {
    id: string;
    autoId: string;
    clienteId: string;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRetorno: Date | null;
    estado: EstadoReserva;
    precioTotal: number;
    penalidad: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CrearReservaParams {
    autoId: string;
    clienteId: string;
    fechaInicio: Date;
    fechaFin: Date;
    precioTotal: number;
}

export interface ReconstructReservaParams {
    id: string;
    autoId: string;
    clienteId: string;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRetorno: Date | null;
    estado: EstadoReserva;
    precioTotal: number;
    penalidad: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Reserva {
    private readonly _id: string;
    private readonly _autoId: string;
    private readonly _clienteId: string;
    private readonly _createdAt: Date;

    private constructor(props: ReservaProperties) {
        this._id = props.id;
        this._autoId = props.autoId;
        this._clienteId = props.clienteId;
        this._fechaInicio = props.fechaInicio;
        this._fechaFin = props.fechaFin;
        this._fechaRetorno = props.fechaRetorno;
        this._estado = props.estado;
        this._precioTotal = props.precioTotal;
        this._penalidad = props.penalidad;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    private _fechaInicio: Date;

    get fechaInicio(): Date {
        return this._fechaInicio;
    }

    private _fechaFin: Date;

    get fechaFin(): Date {
        return this._fechaFin;
    }

    private _fechaRetorno: Date | null;

    get fechaRetorno(): Date | null {
        return this._fechaRetorno;
    }

    private _estado: EstadoReserva;

    get estado(): EstadoReserva {
        return this._estado;
    }

    private _precioTotal: number;

    get precioTotal(): number {
        return this._precioTotal;
    }

    private _penalidad: number | null;

    get penalidad(): number | null {
        return this._penalidad;
    }

    private _updatedAt: Date;

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get id(): string {
        return this._id;
    }

    get autoId(): string {
        return this._autoId;
    }

    get clienteId(): string {
        return this._clienteId;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    static create(params: CrearReservaParams): Reserva {
        const now = new Date();
        return new Reserva({
            id: uuidv7(),
            autoId: params.autoId,
            clienteId: params.clienteId,
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            fechaRetorno: null,
            estado: ESTADOS_RESERVA.PENDIENTE,
            precioTotal: params.precioTotal,
            penalidad: null,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstruct(params: ReconstructReservaParams): Reserva {
        return new Reserva({
            id: params.id,
            autoId: params.autoId,
            clienteId: params.clienteId,
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            fechaRetorno: params.fechaRetorno,
            estado: params.estado,
            precioTotal: params.precioTotal,
            penalidad: params.penalidad,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt,
        });
    }

    private transitions(evento: EventoReserva): void {
        this._estado = maquinaEstadosReserva.transicionar(this._estado, evento);
        this._updatedAt = new Date();
    }

    confirmar(): void {
        this.transitions('confirmar');
    }

    iniciar(): void {
        this.transitions('iniciar');
    }

    completar(fechaRetorno: Date, penalidad: number | null = null): void {
        this.transitions('completar');
        this._fechaRetorno = fechaRetorno;
        this._penalidad = penalidad;
    }

    cancelar(): void {
        this.transitions('cancelar');
    }

    calcularPenalidad(fechaRetorno: Date, precioPorHora: number): number {
        const diffMs = fechaRetorno.getTime() - this._fechaFin.getTime();
        const diffMinutes = diffMs / (TIEMPO.MILISEGUNDOS_POR_SEGUNDO * TIEMPO.SEGUNDOS_POR_MINUTO);

        if (diffMinutes <= PENALIDAD.TOLERANCIA_MINUTOS) {
            return 0;
        }

        const horasExcedidas = Math.ceil(diffMinutes / TIEMPO.MINUTOS_POR_HORA);
        return horasExcedidas * precioPorHora * PENALIDAD.MULTIPLICADOR;
    }

    seSolapaCon(otraFechaInicio: Date, otraFechaFin: Date): boolean {
        return (
            !maquinaEstadosReserva.esEstadoFinal(this._estado) &&
            this._fechaInicio < otraFechaFin &&
            this._fechaFin > otraFechaInicio
        );
    }

    actualizarFechasYPrecio(fechaInicio: Date, fechaFin: Date, precioTotal: number): void {
        if (maquinaEstadosReserva.esEstadoFinal(this._estado)) {
            throw new Error('No se puede modificar una reserva completada o cancelada');
        }
        this._fechaInicio = fechaInicio;
        this._fechaFin = fechaFin;
        this._precioTotal = precioTotal;
        this._updatedAt = new Date();
    }
}
