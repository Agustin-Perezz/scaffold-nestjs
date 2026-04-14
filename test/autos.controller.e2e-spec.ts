import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import * as request from 'supertest';
import { AlquilerAutosModule } from '../src/alquiler-autos.module';
import {
    OperacionReservaInvalidaFilter,
    ReservaNoEncontradaFilter,
    AutoNoDisponibleFilter,
    ReservaSolapadaFilter,
    ClienteNoEncontradoFilter,
    AutoNoEncontradoFilter,
} from '../src/infrastructure/exceptions/reserva.exception-filters';

describe('Autos Controller (e2e)', () => {
    let app: INestApplication;
    let autoId: string;

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

        app.useGlobalFilters(
            new OperacionReservaInvalidaFilter(),
            new ReservaNoEncontradaFilter(),
            new AutoNoDisponibleFilter(),
            new ReservaSolapadaFilter(),
            new ClienteNoEncontradoFilter(),
            new AutoNoEncontradoFilter(),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/autos (POST)', () => {
        it('debe crear un auto correctamente', () => {
            return request(app.getHttpServer())
                .post('/autos')
                .send({
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    anio: 2023,
                    patente: 'ABC123',
                    precioPorHora: 1000,
                })
                .expect(201)
                .then((response) => {
                    expect(response.body).toHaveProperty('id');
                    expect(response.body.marca).toBe('Toyota');
                    expect(response.body.modelo).toBe('Corolla');
                    expect(response.body.disponible).toBe(true);
                    autoId = response.body.id;
                });
        });

        it('debe rechazar auto con patente duplicada', async () => {
            await request(app.getHttpServer())
                .post('/autos')
                .send({
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    anio: 2023,
                    patente: 'ABC123',
                    precioPorHora: 1000,
                })
                .expect(400);
        });

        it('debe rechazar auto con datos inválidos', () => {
            return request(app.getHttpServer())
                .post('/autos')
                .send({
                    marca: '',
                    modelo: '',
                    anio: 1800,
                    patente: '',
                    precioPorHora: -100,
                })
                .expect(400);
        });
    });

    describe('/autos (GET)', () => {
        it('debe listar todos los autos', () => {
            return request(app.getHttpServer())
                .get('/autos')
                .send({ soloDisponibles: false })
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                    expect(response.body.length).toBeGreaterThan(0);
                });
        });

        it('debe obtener un auto por ID', () => {
            return request(app.getHttpServer())
                .get(`/autos/${autoId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.id).toBe(autoId);
                    expect(response.body.marca).toBe('Toyota');
                });
        });

        it('debe retornar 404 para auto inexistente', () => {
            return request(app.getHttpServer())
                .get('/autos/99999999')
                .expect(404);
        });
    });

    describe('/autos/:id (PUT)', () => {
        it('debe actualizar un auto', () => {
            return request(app.getHttpServer())
                .put(`/autos/${autoId}`)
                .send({
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    anio: 2023,
                    patente: 'ABC123',
                    precioPorHora: 1500,
                })
                .expect(200)
                .then((response) => {
                    expect(response.body.precioPorHora).toBe(1500);
                });
        });
    });

    describe('/autos/:id (DELETE)', () => {
        it('debe eliminar un auto', () => {
            return request(app.getHttpServer())
                .delete(`/autos/${autoId}`)
                .expect(204);
        });

        it('debe retornar 404 al obtener auto eliminado', () => {
            return request(app.getHttpServer())
                .get(`/autos/${autoId}`)
                .expect(404);
        });
    });
});
