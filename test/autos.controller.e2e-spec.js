"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const request = require("supertest");
const alquiler_autos_module_1 = require("../src/alquiler-autos.module");
const reserva_exception_filters_1 = require("../src/infrastructure/exceptions/reserva.exception-filters");
describe('Autos Controller (e2e)', () => {
    let app;
    let autoId;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                alquiler_autos_module_1.AlquilerAutosModule,
            ],
        }).compile();
        const orm = moduleFixture.get(core_1.MikroORM);
        await orm.schema.refreshDatabase();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        app.useGlobalFilters(new reserva_exception_filters_1.OperacionReservaInvalidaFilter(), new reserva_exception_filters_1.ReservaNoEncontradaFilter(), new reserva_exception_filters_1.AutoNoDisponibleFilter(), new reserva_exception_filters_1.ReservaSolapadaFilter(), new reserva_exception_filters_1.ClienteNoEncontradoFilter(), new reserva_exception_filters_1.AutoNoEncontradoFilter());
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
//# sourceMappingURL=autos.controller.e2e-spec.js.map