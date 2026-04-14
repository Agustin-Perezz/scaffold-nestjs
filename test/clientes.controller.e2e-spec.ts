import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import * as request from 'supertest';
import { AlquilerAutosModule } from '../src/alquiler-autos.module';

describe('Clientes Controller (e2e)', () => {
    let app: INestApplication;
    let clienteId: string;
    let orm: MikroORM;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AlquilerAutosModule,
            ],
        }).compile();

        orm = moduleFixture.get(MikroORM);
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

    describe('/clientes (POST)', () => {
        it('debe crear un cliente correctamente', () => {
            return request(app.getHttpServer())
                .post('/clientes')
                .send({
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    dni: '12345678',
                    email: 'juan.perez@email.com',
                    telefono: '11-1234-5678',
                })
                .expect(201)
                .then((response) => {
                    expect(response.body).toHaveProperty('id');
                    expect(response.body.nombre).toBe('Juan');
                    expect(response.body.apellido).toBe('Pérez');
                    clienteId = response.body.id;
                });
        });

        it('debe rechazar cliente con DNI duplicado', async () => {
            await request(app.getHttpServer())
                .post('/clientes')
                .send({
                    nombre: 'María',
                    apellido: 'González',
                    dni: '12345678',
                    email: 'maria.gonzalez@email.com',
                    telefono: '11-8765-4321',
                })
                .expect(400);
        });

        it('debe rechazar cliente con datos inválidos', () => {
            return request(app.getHttpServer())
                .post('/clientes')
                .send({
                    nombre: '',
                    apellido: '',
                    dni: 'abc',
                    email: 'email-invalido',
                    telefono: '',
                })
                .expect(400);
        });
    });

    describe('/clientes (GET)', () => {
        it('debe listar todos los clientes', () => {
            return request(app.getHttpServer())
                .get('/clientes')
                .expect(200)
                .then((response) => {
                    expect(response.body).toHaveProperty('clientes');
                    expect(Array.isArray(response.body.clientes)).toBe(true);
                    expect(response.body.clientes.length).toBeGreaterThan(0);
                });
        });

        it('debe obtener un cliente por ID', () => {
            return request(app.getHttpServer())
                .get(`/clientes/${clienteId}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.id).toBe(clienteId);
                    expect(response.body.nombre).toBe('Juan');
                });
        });

        it('debe retornar 404 para cliente inexistente', () => {
            return request(app.getHttpServer())
                .get('/clientes/99999999')
                .expect(404);
        });
    });

    describe('/clientes/:id (PUT)', () => {
        it('debe actualizar un cliente', () => {
            return request(app.getHttpServer())
                .put(`/clientes/${clienteId}`)
                .send({
                    telefono: '11-9999-8888',
                    email: 'juancarlos@email.com',
                })
                .expect(200)
                .then((response) => {
                    expect(response.body.email).toBe('juancarlos@email.com');
                    expect(response.body.telefono).toBe('11-9999-8888');
                });
        });
    });

    describe('/clientes/:id (DELETE)', () => {
        it('debe eliminar un cliente', () => {
            return request(app.getHttpServer())
                .delete(`/clientes/${clienteId}`)
                .expect(204);
        });

        it('debe retornar 404 al obtener cliente eliminado', () => {
            return request(app.getHttpServer())
                .get(`/clientes/${clienteId}`)
                .expect(404);
        });
    });
});
