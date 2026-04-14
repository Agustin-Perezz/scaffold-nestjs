export class OperacionReservaInvalida extends Error {
    constructor(
        public readonly estadoActual: string,
        public readonly evento: string,
        public readonly eventosValidos: string[],
    ) {
        super(
            `No se puede '${evento}' desde el estado '${estadoActual}'. Acciones válidas: ${eventosValidos.length > 0 ? eventosValidos.join(', ') : 'ninguna'}`,
        );
        this.name = 'OperacionReservaInvalida';
    }
}

export class ReservaNoEncontrada extends Error {
    constructor(public readonly id: string) {
        super(`Reserva con id '${id}' no encontrada`);
        this.name = 'ReservaNoEncontrada';
    }
}

export class AutoNoDisponible extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AutoNoDisponible';
    }
}

export class ReservaSolapada extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ReservaSolapada';
    }
}

export class ClienteNoEncontrado extends Error {
    constructor(public readonly id: string) {
        super(`Cliente con id '${id}' no encontrado`);
        this.name = 'ClienteNoEncontrado';
    }
}

export class AutoNoEncontrado extends Error {
    constructor(public readonly id: string) {
        super(`Auto con id '${id}' no encontrado`);
        this.name = 'AutoNoEncontrado';
    }
}
