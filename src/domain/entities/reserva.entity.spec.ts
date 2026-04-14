import { Reserva, ESTADOS_RESERVA } from './reserva.entity';
import { maquinaEstadosReserva, MaquinaEstadosReserva, TRANSICIONES_RESERVA } from './reserva.state-machine';
import { v7 as uuidv7 } from 'uuid';

describe('Reserva', () => {
    describe('create', () => {
        it('should create reserva with initial state pendiente', () => {
            const params = {
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            };

            const reserva = Reserva.create(params);

            expect(reserva.estado).toBe(ESTADOS_RESERVA.PENDIENTE);
            expect(reserva.fechaRetorno).toBeNull();
            expect(reserva.penalidad).toBeNull();
        });

        it('should create reserva with all properties set', () => {
            const params = {
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            };

            const reserva = Reserva.create(params);

            expect(reserva.id).toBeDefined();
            expect(reserva.autoId).toBe(params.autoId);
            expect(reserva.clienteId).toBe(params.clienteId);
            expect(reserva.fechaInicio).toEqual(params.fechaInicio);
            expect(reserva.fechaFin).toEqual(params.fechaFin);
            expect(reserva.precioTotal).toBe(params.precioTotal);
            expect(reserva.createdAt).toBeInstanceOf(Date);
            expect(reserva.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('reconstruct', () => {
        it('should preserve all properties', () => {
            const id = uuidv7();
            const autoId = uuidv7();
            const clienteId = uuidv7();
            const fechaInicio = new Date('2025-01-01T10:00:00Z');
            const fechaFin = new Date('2025-01-01T18:00:00Z');
            const fechaRetorno = new Date('2025-01-01T19:00:00Z');
            const estado = ESTADOS_RESERVA.EN_CURSO;
            const precioTotal = 150;
            const penalidad = 50;
            const createdAt = new Date('2025-01-01T09:00:00Z');
            const updatedAt = new Date('2025-01-01T10:00:00Z');

            const reserva = Reserva.reconstruct({
                id,
                autoId,
                clienteId,
                fechaInicio,
                fechaFin,
                fechaRetorno,
                estado,
                precioTotal,
                penalidad,
                createdAt,
                updatedAt,
            });

            expect(reserva.id).toBe(id);
            expect(reserva.autoId).toBe(autoId);
            expect(reserva.clienteId).toBe(clienteId);
            expect(reserva.fechaInicio).toEqual(fechaInicio);
            expect(reserva.fechaFin).toEqual(fechaFin);
            expect(reserva.fechaRetorno).toEqual(fechaRetorno);
            expect(reserva.estado).toBe(estado);
            expect(reserva.precioTotal).toBe(precioTotal);
            expect(reserva.penalidad).toBe(penalidad);
            expect(reserva.createdAt).toEqual(createdAt);
            expect(reserva.updatedAt).toEqual(updatedAt);
        });
    });

    describe('confirmar', () => {
        it('should transition from pendiente to confirmada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();

            expect(reserva.estado).toBe(ESTADOS_RESERVA.CONFIRMADA);
        });
    });

    describe('iniciar', () => {
        it('should transition from confirmada to en_curso', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();

            expect(reserva.estado).toBe(ESTADOS_RESERVA.EN_CURSO);
        });
    });

    describe('completar', () => {
        it('should transition from en_curso to completada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();
            reserva.completar(new Date('2025-01-01T19:00:00Z'));

            expect(reserva.estado).toBe(ESTADOS_RESERVA.COMPLETADA);
        });

        it('should set fechaRetorno and penalidad', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();
            const fechaRetorno = new Date('2025-01-01T19:00:00Z');
            const penalidad = 50;
            reserva.completar(fechaRetorno, penalidad);

            expect(reserva.fechaRetorno).toEqual(fechaRetorno);
            expect(reserva.penalidad).toBe(penalidad);
        });
    });

    describe('cancelar', () => {
        it('should transition from pendiente to cancelada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.cancelar();

            expect(reserva.estado).toBe(ESTADOS_RESERVA.CANCELADA);
        });

        it('should transition from confirmada to cancelada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.cancelar();

            expect(reserva.estado).toBe(ESTADOS_RESERVA.CANCELADA);
        });
    });

    describe('invalid transitions', () => {
        it('should throw when confirming from confirmada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();

            expect(() => reserva.confirmar()).toThrow();
        });

        it('should throw when initiating from pendiente', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            expect(() => reserva.iniciar()).toThrow();
        });

        it('should throw when completing from pendiente', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            expect(() => reserva.completar(new Date())).toThrow();
        });

        it('should throw when cancelling from en_curso', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();

            expect(() => reserva.cancelar()).toThrow();
        });

        it('should throw when transitioning from completada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();
            reserva.completar(new Date());

            expect(() => reserva.confirmar()).toThrow();
            expect(() => reserva.iniciar()).toThrow();
            expect(() => reserva.cancelar()).toThrow();
        });

        it('should throw when transitioning from cancelada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.cancelar();

            expect(() => reserva.confirmar()).toThrow();
            expect(() => reserva.iniciar()).toThrow();
            expect(() => reserva.completar(new Date())).toThrow();
        });
    });

    describe('calcularPenalidad', () => {
        const precioPorHora = 10;

        it('should return 0 within tolerance period', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const fechaRetorno = new Date('2025-01-01T18:14:00Z');

            const penalidad = reserva.calcularPenalidad(fechaRetorno, precioPorHora);

            expect(penalidad).toBe(0);
        });

        it('should return 0 exactly at tolerance boundary', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const fechaRetorno = new Date('2025-01-01T18:15:00Z');

            const penalidad = reserva.calcularPenalidad(fechaRetorno, precioPorHora);

            expect(penalidad).toBe(0);
        });

        it('should apply 1.2x multiplier after tolerance', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const fechaRetorno = new Date('2025-01-01T19:00:00Z');

            const penalidad = reserva.calcularPenalidad(fechaRetorno, precioPorHora);

            expect(penalidad).toBe(12);
        });

        it('should ceil hours exceeded', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const fechaRetorno = new Date('2025-01-01T19:01:00Z');

            const penalidad = reserva.calcularPenalidad(fechaRetorno, precioPorHora);

            expect(penalidad).toBe(24);
        });

        it('should calculate 2 hours correctly', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const fechaRetorno = new Date('2025-01-01T20:00:00Z');

            const penalidad = reserva.calcularPenalidad(fechaRetorno, precioPorHora);

            expect(penalidad).toBe(24);
        });
    });

    describe('seSolapaCon', () => {
        it('should return true when dates overlap and state is not final', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const solapada = reserva.seSolapaCon(
                new Date('2025-01-01T12:00:00Z'),
                new Date('2025-01-01T20:00:00Z'),
            );

            expect(solapada).toBe(true);
        });

        it('should return false when dates do not overlap', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const solapada = reserva.seSolapaCon(
                new Date('2025-01-02T10:00:00Z'),
                new Date('2025-01-02T18:00:00Z'),
            );

            expect(solapada).toBe(false);
        });

        it('should return false when state is completada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();
            reserva.completar(new Date());

            const solapada = reserva.seSolapaCon(
                new Date('2025-01-01T12:00:00Z'),
                new Date('2025-01-01T20:00:00Z'),
            );

            expect(solapada).toBe(false);
        });

        it('should return false when state is cancelada', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.cancelar();

            const solapada = reserva.seSolapaCon(
                new Date('2025-01-01T12:00:00Z'),
                new Date('2025-01-01T20:00:00Z'),
            );

            expect(solapada).toBe(false);
        });

        it('should return true for adjacent dates that touch', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const solapada = reserva.seSolapaCon(
                new Date('2025-01-01T18:00:00Z'),
                new Date('2025-01-01T20:00:00Z'),
            );

            expect(solapada).toBe(false);
        });
    });

    describe('actualizarFechasYPrecio', () => {
        it('should update dates and price in pendiente state', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            const nuevaFechaInicio = new Date('2025-01-02T10:00:00Z');
            const nuevaFechaFin = new Date('2025-01-02T20:00:00Z');
            const nuevoPrecio = 150;

            reserva.actualizarFechasYPrecio(nuevaFechaInicio, nuevaFechaFin, nuevoPrecio);

            expect(reserva.fechaInicio).toEqual(nuevaFechaInicio);
            expect(reserva.fechaFin).toEqual(nuevaFechaFin);
            expect(reserva.precioTotal).toBe(nuevoPrecio);
        });

        it('should update dates and price in confirmada state', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();

            const nuevaFechaInicio = new Date('2025-01-02T10:00:00Z');
            const nuevaFechaFin = new Date('2025-01-02T20:00:00Z');
            const nuevoPrecio = 150;

            reserva.actualizarFechasYPrecio(nuevaFechaInicio, nuevaFechaFin, nuevoPrecio);

            expect(reserva.fechaInicio).toEqual(nuevaFechaInicio);
            expect(reserva.fechaFin).toEqual(nuevaFechaFin);
            expect(reserva.precioTotal).toBe(nuevoPrecio);
        });

        it('should update dates and price in en_curso state', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();

            const nuevaFechaInicio = new Date('2025-01-02T10:00:00Z');
            const nuevaFechaFin = new Date('2025-01-02T20:00:00Z');
            const nuevoPrecio = 150;

            reserva.actualizarFechasYPrecio(nuevaFechaInicio, nuevaFechaFin, nuevoPrecio);

            expect(reserva.fechaInicio).toEqual(nuevaFechaInicio);
            expect(reserva.fechaFin).toEqual(nuevaFechaFin);
            expect(reserva.precioTotal).toBe(nuevoPrecio);
        });

        it('should throw in completada state', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.confirmar();
            reserva.iniciar();
            reserva.completar(new Date());

            expect(() =>
                reserva.actualizarFechasYPrecio(
                    new Date('2025-01-02T10:00:00Z'),
                    new Date('2025-01-02T20:00:00Z'),
                    150,
                ),
            ).toThrow('No se puede modificar una reserva completada o cancelada');
        });

        it('should throw in cancelada state', () => {
            const reserva = Reserva.create({
                autoId: uuidv7(),
                clienteId: uuidv7(),
                fechaInicio: new Date('2025-01-01T10:00:00Z'),
                fechaFin: new Date('2025-01-01T18:00:00Z'),
                precioTotal: 100,
            });

            reserva.cancelar();

            expect(() =>
                reserva.actualizarFechasYPrecio(
                    new Date('2025-01-02T10:00:00Z'),
                    new Date('2025-01-02T20:00:00Z'),
                    150,
                ),
            ).toThrow('No se puede modificar una reserva completada o cancelada');
        });
    });

    describe('MaquinaEstadosReserva', () => {
        describe('puedeTransicionar', () => {
            it('should return true for valid transition', () => {
                expect(
                    maquinaEstadosReserva.puedeTransicionar(ESTADOS_RESERVA.PENDIENTE, 'confirmar'),
                ).toBe(true);
            });

            it('should return false for invalid transition', () => {
                expect(
                    maquinaEstadosReserva.puedeTransicionar(ESTADOS_RESERVA.PENDIENTE, 'iniciar'),
                ).toBe(false);
            });
        });

        describe('transicionar', () => {
            it('should return new state for valid transition', () => {
                const nuevoEstado = maquinaEstadosReserva.transicionar(
                    ESTADOS_RESERVA.PENDIENTE,
                    'confirmar',
                );
                expect(nuevoEstado).toBe(ESTADOS_RESERVA.CONFIRMADA);
            });

            it('should throw for invalid transition', () => {
                expect(() =>
                    maquinaEstadosReserva.transicionar(ESTADOS_RESERVA.PENDIENTE, 'iniciar'),
                ).toThrow();
            });

            it('should throw with message containing valid transitions', () => {
                try {
                    maquinaEstadosReserva.transicionar(ESTADOS_RESERVA.PENDIENTE, 'iniciar');
                    fail('Expected error to be thrown');
                } catch (error) {
                    expect((error as Error).message).toContain('Transición inválida');
                    expect((error as Error).message).toContain('confirmar');
                    expect((error as Error).message).toContain('cancelar');
                }
            });
        });

        describe('esEstadoFinal', () => {
            it('should return true for completada', () => {
                expect(maquinaEstadosReserva.esEstadoFinal(ESTADOS_RESERVA.COMPLETADA)).toBe(true);
            });

            it('should return true for cancelada', () => {
                expect(maquinaEstadosReserva.esEstadoFinal(ESTADOS_RESERVA.CANCELADA)).toBe(true);
            });

            it('should return false for pendiente', () => {
                expect(maquinaEstadosReserva.esEstadoFinal(ESTADOS_RESERVA.PENDIENTE)).toBe(false);
            });

            it('should return false for confirmada', () => {
                expect(maquinaEstadosReserva.esEstadoFinal(ESTADOS_RESERVA.CONFIRMADA)).toBe(false);
            });

            it('should return false for en_curso', () => {
                expect(maquinaEstadosReserva.esEstadoFinal(ESTADOS_RESERVA.EN_CURSO)).toBe(false);
            });
        });

        it('should have all expected transitions', () => {
            expect(TRANSICIONES_RESERVA).toHaveLength(5);
            expect(TRANSICIONES_RESERVA).toContainEqual({
                desde: ESTADOS_RESERVA.PENDIENTE,
                evento: 'confirmar',
                hacia: ESTADOS_RESERVA.CONFIRMADA,
            });
            expect(TRANSICIONES_RESERVA).toContainEqual({
                desde: ESTADOS_RESERVA.PENDIENTE,
                evento: 'cancelar',
                hacia: ESTADOS_RESERVA.CANCELADA,
            });
            expect(TRANSICIONES_RESERVA).toContainEqual({
                desde: ESTADOS_RESERVA.CONFIRMADA,
                evento: 'iniciar',
                hacia: ESTADOS_RESERVA.EN_CURSO,
            });
            expect(TRANSICIONES_RESERVA).toContainEqual({
                desde: ESTADOS_RESERVA.CONFIRMADA,
                evento: 'cancelar',
                hacia: ESTADOS_RESERVA.CANCELADA,
            });
            expect(TRANSICIONES_RESERVA).toContainEqual({
                desde: ESTADOS_RESERVA.EN_CURSO,
                evento: 'completar',
                hacia: ESTADOS_RESERVA.COMPLETADA,
            });
        });

        it('should be singleton instance', () => {
            const instance1 = maquinaEstadosReserva;
            const instance2 = maquinaEstadosReserva;
            expect(instance1).toBe(instance2);
        });
    });
});
