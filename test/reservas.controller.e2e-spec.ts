import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import * as request from 'supertest';
import { AlquilerAutosModule } from '../src/alquiler-autos.module';

describe('Reservas Controller (e2e)', () => {
    let app: INestApplication;
    let autoId: string;
    let clienteId: string;
    let reservaId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AlquilerAutosModule,
            ],
        }).compile();

        const orm = moduleFixture.get(MikroORM);
        await orm.schema.refreshDatabase();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('/reservas (POST)', () => {
        it('debe crear una reserva correctamente', async () => {
            const autoResponse = await request(app.getHttpServer())
                .post('/autos')
                .send({
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    anio: 2023,
                    patente: 'ABC123',
                    precioPorHora: 1000,
                });
            autoId = autoResponse.body.id;

            const clienteResponse = await request(app.getHttpServer())
                .post('/clientes')
                .send({
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    dni: '12345678',
                    email: 'juan@email.com',
                    telefono: '11-1234-5678',
                });
            clienteId = clienteResponse.body.id;

            const fechaInicio = new Date();
            fechaInicio.setDate(fechaInicio.getDate() + 1);
            const fechaFin = new Date();
            fechaFin.setDate(fechaFin.getDate() + 3);

            return request(app.getHttpServer())
                .post('/reservas')
                .send({
                    autoId: autoId,
                    clienteId: clienteId,
                    fechaInicio: fechaInicio.toISOString(),
                    fechaFin: fechaFin.toISOString(),
                    precioTotal: 5000,
                })
                .expect(201)
                .then((response) => {
                    expect(response.body).toHaveProperty('id');
                    expect(response.body.autoId).toBe(autoId);
                    expect(response.body.clienteId).toBe(clienteId);
                    expect(response.body.estado).toBe('pendiente');
                    reservaId = response.body.id;
                });
        });
    });

    describe('/reservas (GET)', () => {
        it('debe listar todas las reservas', () => {
            return request(app.getHttpServer())
                .get('/reservas')
                .expect(200)
                .then((response) => {
                    expect(response.body).toHaveProperty('reservas');
                    expect(Array.isArray(response.body.reservas)).toBe(true);
                });
        });
    });

    describe('/reservas/:id (GET)', () => {
        it('debe obtener una reserva por ID', () => {
            return request(app.getHttpServer())
                .get(`/reservas/${reservaId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.id).toBe(reservaId);
                });
        });

        it('debe retornar 404 para reserva inexistente', () => {
            return request(app.getHttpServer())
                .get('/reservas/99999999')
                .expect(404);
        });
    });

    describe('/reservas/:id/confirmar (POST)', () => {
        it('debe confirmar una reserva pendiente', () => {
            return request(app.getHttpServer())
                .post(`/reservas/${reservaId}/confirmar`)
                .expect(201)
                .then((response) => {
                    expect(response.body.estado).toBe('confirmada');
                });
        });

        it('debe retornar 404 al confirmar reserva inexistente', () => {
            return request(app.getHttpServer())
                .post('/reservas/99999999/confirmar')
                .expect(404);
        });
    });

    describe('/reservas/:id/iniciar (POST)', () => {
        it('debe iniciar una reserva confirmada', () => {
            return request(app.getHttpServer())
                .post(`/reservas/${reservaId}/iniciar`)
                .expect(201)
                .then((response) => {
                    expect(response.body.estado).toBe('en_curso');
                });
        });
    });

    describe('/reservas/:id/cancelar (POST)', () => {
        it('debe retornar 404 al cancelar reserva inexistente', () => {
            return request(app.getHttpServer())
                .post('/reservas/99999999/cancelar')
                .expect(404);
        });
    });

    describe('/reservas/:id/devolver (POST)', () => {
        it('debe devolver un auto de reserva en curso', () => {
            const fechaRetorno = new Date();
            fechaRetorno.setHours(fechaRetorno.getHours() + 1);

            return request(app.getHttpServer())
                .post(`/reservas/${reservaId}/devolver`)
                .send({ fechaRetorno: fechaRetorno.toISOString() })
                .expect(201)
                .then((response) => {
                    expect(response.body.estado).toBe('completada');
                    expect(response.body).toHaveProperty('fechaRetorno');
                });
        });
    });
});
