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
