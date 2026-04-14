import { ESTADOS_RESERVA, EstadoReserva } from './reserva.constants';

export type EventoReserva = 'confirmar' | 'iniciar' | 'completar' | 'cancelar';

export interface TransicionEstado {
    desde: EstadoReserva;
    evento: EventoReserva;
    hacia: EstadoReserva;
}

export const TRANSICIONES_RESERVA: TransicionEstado[] = [
    { desde: ESTADOS_RESERVA.PENDIENTE, evento: 'confirmar', hacia: ESTADOS_RESERVA.CONFIRMADA },
    { desde: ESTADOS_RESERVA.PENDIENTE, evento: 'cancelar', hacia: ESTADOS_RESERVA.CANCELADA },
    { desde: ESTADOS_RESERVA.CONFIRMADA, evento: 'iniciar', hacia: ESTADOS_RESERVA.EN_CURSO },
    { desde: ESTADOS_RESERVA.CONFIRMADA, evento: 'cancelar', hacia: ESTADOS_RESERVA.CANCELADA },
    { desde: ESTADOS_RESERVA.EN_CURSO, evento: 'completar', hacia: ESTADOS_RESERVA.COMPLETADA },
];

export const ESTADOS_FINALES: EstadoReserva[] = [
    ESTADOS_RESERVA.COMPLETADA,
    ESTADOS_RESERVA.CANCELADA,
];

export class MaquinaEstadosReserva {
    private transiciones: Map<string, EstadoReserva>;

    constructor(transiciones: TransicionEstado[]) {
        this.transiciones = new Map();
        transiciones.forEach((t) => {
            this.transiciones.set(`${t.desde}:${t.evento}`, t.hacia);
        });
    }

    puedeTransicionar(estadoActual: EstadoReserva, evento: EventoReserva): boolean {
        return this.transiciones.has(`${estadoActual}:${evento}`);
    }

    transicionar(estadoActual: EstadoReserva, evento: EventoReserva): EstadoReserva {
        const clave = `${estadoActual}:${evento}`;
        const nuevoEstado = this.transiciones.get(clave);

        if (!nuevoEstado) {
            const transicionesValidas = this.obtenerTransicionesValidas(estadoActual);
            throw new Error(
                `Transición inválida: no se puede '${evento}' desde '${estadoActual}'. ` +
                    `Transiciones válidas: ${transicionesValidas.length > 0 ? transicionesValidas.join(', ') : 'ninguna'}`,
            );
        }

        return nuevoEstado;
    }

    obtenerTransicionesValidas(estadoActual: EstadoReserva): EventoReserva[] {
        const eventos: EventoReserva[] = [];
        this.transiciones.forEach((_, clave) => {
            const [estado, evento] = clave.split(':') as [EstadoReserva, EventoReserva];
            if (estado === estadoActual) {
                eventos.push(evento);
            }
        });
        return eventos;
    }

    esEstadoFinal(estado: EstadoReserva): boolean {
        return ESTADOS_FINALES.includes(estado);
    }
}

export const maquinaEstadosReserva = new MaquinaEstadosReserva(TRANSICIONES_RESERVA);
