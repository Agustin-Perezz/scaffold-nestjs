import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { AutoEntity } from './infrastructure/database/postgres/entities/auto.entity';
import { ClienteEntity } from './infrastructure/database/postgres/entities/cliente.entity';
import { ReservaEntity } from './infrastructure/database/postgres/entities/reserva.entity';

import { CrearAutoRepository } from './infrastructure/database/postgres/repositories/autos/crear-auto.repository';
import { ObtenerAutoRepository } from './infrastructure/database/postgres/repositories/autos/obtener-auto.repository';
import { ListarAutosRepository } from './infrastructure/database/postgres/repositories/autos/listar-autos.repository';
import { ActualizarAutoRepository } from './infrastructure/database/postgres/repositories/autos/actualizar-auto.repository';
import { EliminarAutoRepository } from './infrastructure/database/postgres/repositories/autos/eliminar-auto.repository';

import { CrearClienteRepository } from './infrastructure/database/postgres/repositories/clientes/crear-cliente.repository';
import { ObtenerClienteRepository } from './infrastructure/database/postgres/repositories/clientes/obtener-cliente.repository';
import { ListarClientesRepository } from './infrastructure/database/postgres/repositories/clientes/listar-clientes.repository';
import { ActualizarClienteRepository } from './infrastructure/database/postgres/repositories/clientes/actualizar-cliente.repository';
import { EliminarClienteRepository } from './infrastructure/database/postgres/repositories/clientes/eliminar-cliente.repository';

import { CrearReservaRepository } from './infrastructure/database/postgres/repositories/reservas/crear-reserva.repository';
import { ObtenerReservaRepository } from './infrastructure/database/postgres/repositories/reservas/obtener-reserva.repository';
import { ListarReservasRepository } from './infrastructure/database/postgres/repositories/reservas/listar-reservas.repository';
import { ActualizarReservaRepository } from './infrastructure/database/postgres/repositories/reservas/actualizar-reserva.repository';
import { EliminarReservaRepository } from './infrastructure/database/postgres/repositories/reservas/eliminar-reserva.repository';
import { DevolverAutoRepository } from './infrastructure/database/postgres/repositories/reservas/devolver-auto.repository';
import { ConfirmarReservaRepository } from './infrastructure/database/postgres/repositories/reservas/confirmar-reserva.repository';
import { IniciarReservaRepository } from './infrastructure/database/postgres/repositories/reservas/iniciar-reserva.repository';
import { CancelarReservaRepository } from './infrastructure/database/postgres/repositories/reservas/cancelar-reserva.repository';

import { CrearAutoUseCase } from './application/use-cases/autos/crear-auto/crear-auto.use-case';
import { ObtenerAutoUseCase } from './application/use-cases/autos/obtener-auto/obtener-auto.use-case';
import { ListarAutosUseCase } from './application/use-cases/autos/listar-autos/listar-autos.use-case';
import { ActualizarAutoUseCase } from './application/use-cases/autos/actualizar-auto/actualizar-auto.use-case';
import { EliminarAutoUseCase } from './application/use-cases/autos/eliminar-auto/eliminar-auto.use-case';

import { CrearClienteUseCase } from './application/use-cases/clientes/crear-cliente/crear-cliente.use-case';
import { ObtenerClienteUseCase } from './application/use-cases/clientes/obtener-cliente/obtener-cliente.use-case';
import { ListarClientesUseCase } from './application/use-cases/clientes/listar-clientes/listar-clientes.use-case';
import { ActualizarClienteUseCase } from './application/use-cases/clientes/actualizar-cliente/actualizar-cliente.use-case';
import { EliminarClienteUseCase } from './application/use-cases/clientes/eliminar-cliente/eliminar-cliente.use-case';

import { CrearReservaUseCase } from './application/use-cases/reservas/crear-reserva/crear-reserva.use-case';
import { ObtenerReservaUseCase } from './application/use-cases/reservas/obtener-reserva/obtener-reserva.use-case';
import { ListarReservasUseCase } from './application/use-cases/reservas/listar-reservas/listar-reservas.use-case';
import { ActualizarReservaUseCase } from './application/use-cases/reservas/actualizar-reserva/actualizar-reserva.use-case';
import { EliminarReservaUseCase } from './application/use-cases/reservas/eliminar-reserva/eliminar-reserva.use-case';
import { DevolverAutoUseCase } from './application/use-cases/reservas/devolver-auto/devolver-auto.use-case';
import { ConfirmarReservaUseCase } from './application/use-cases/reservas/confirmar-reserva/confirmar-reserva.use-case';
import { IniciarReservaUseCase } from './application/use-cases/reservas/iniciar-reserva/iniciar-reserva.use-case';
import { CancelarReservaUseCase } from './application/use-cases/reservas/cancelar-reserva/cancelar-reserva.use-case';

import { AutosController } from './presentation/controllers/autos/autos.controller';
import { ClientesController } from './presentation/controllers/clientes/clientes.controller';
import { ReservasController } from './presentation/controllers/reservas/reservas.controller';

@Module({
  controllers: [AutosController, ClientesController, ReservasController],
  providers: [
    {
      provide: 'ICrearAutoRepository',
      useClass: CrearAutoRepository,
    },
    {
      provide: 'IObtenerAutoRepository',
      useClass: ObtenerAutoRepository,
    },
    {
      provide: 'IListarAutosRepository',
      useClass: ListarAutosRepository,
    },
    {
      provide: 'IActualizarAutoRepository',
      useClass: ActualizarAutoRepository,
    },
    {
      provide: 'IEliminarAutoRepository',
      useClass: EliminarAutoRepository,
    },
    {
      provide: 'ICrearClienteRepository',
      useClass: CrearClienteRepository,
    },
    {
      provide: 'IObtenerClienteRepository',
      useClass: ObtenerClienteRepository,
    },
    {
      provide: 'IListarClientesRepository',
      useClass: ListarClientesRepository,
    },
    {
      provide: 'IActualizarClienteRepository',
      useClass: ActualizarClienteRepository,
    },
    {
      provide: 'IEliminarClienteRepository',
      useClass: EliminarClienteRepository,
    },
    {
      provide: 'ICrearReservaRepository',
      useClass: CrearReservaRepository,
    },
    {
      provide: 'IObtenerReservaRepository',
      useClass: ObtenerReservaRepository,
    },
    {
      provide: 'IListarReservasRepository',
      useClass: ListarReservasRepository,
    },
    {
      provide: 'IActualizarReservaRepository',
      useClass: ActualizarReservaRepository,
    },
    {
      provide: 'IEliminarReservaRepository',
      useClass: EliminarReservaRepository,
    },
    {
      provide: 'IDevolverAutoRepository',
      useClass: DevolverAutoRepository,
    },
    {
      provide: 'IConfirmarReservaRepository',
      useClass: ConfirmarReservaRepository,
    },
    {
      provide: 'IIniciarReservaRepository',
      useClass: IniciarReservaRepository,
    },
    {
      provide: 'ICancelarReservaRepository',
      useClass: CancelarReservaRepository,
    },
    CrearAutoUseCase,
    ObtenerAutoUseCase,
    ListarAutosUseCase,
    ActualizarAutoUseCase,
    EliminarAutoUseCase,
    CrearClienteUseCase,
    ObtenerClienteUseCase,
    ListarClientesUseCase,
    ActualizarClienteUseCase,
    EliminarClienteUseCase,
    CrearReservaUseCase,
    ObtenerReservaUseCase,
    ListarReservasUseCase,
    ActualizarReservaUseCase,
    EliminarReservaUseCase,
    DevolverAutoUseCase,
    ConfirmarReservaUseCase,
    IniciarReservaUseCase,
    CancelarReservaUseCase,
  ],
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      clientUrl: `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'rentadora_autos'}`,
      entities: [AutoEntity, ClienteEntity, ReservaEntity],
      allowGlobalContext: true,
    }),
    MikroOrmModule.forFeature([AutoEntity, ClienteEntity, ReservaEntity]),
  ],
})
export class AlquilerAutosModule {}