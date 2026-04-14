import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM, SqlEntityManager } from '@mikro-orm/postgresql';
import { Reserva } from '../../../../../domain/entities/reserva.entity';
import { ReservaEntity } from '../../entities/reserva.entity';
import { IIniciarReservaRepository } from '../../../../../application/use-cases/reservas/iniciar-reserva/iniciar-reserva.repository.interface';

@Injectable()
export class IniciarReservaRepository implements IIniciarReservaRepository {
    constructor(
        @InjectRepository(ReservaEntity)
        private readonly repository: EntityRepository<ReservaEntity>,
        private readonly orm: MikroORM,
    ) {}

    async obtenerPorId(id: string): Promise<Reserva | null> {
        const entity = await this.repository.findOne({ id });
        return entity ? this.aDominio(entity) : null;
    }

    async guardar(reserva: Reserva): Promise<Reserva> {
        return this.orm.em.transactional(async (em: SqlEntityManager) => {
            const entity = await this.repository.findOne({ id: reserva.id });
            if (!entity) {
                throw new Error('Reserva no encontrada');
            }
            entity.estado = reserva.estado;
            entity.updatedAt = reserva.updatedAt;
            await em.persist(entity).flush();
            return this.aDominio(entity);
        });
    }

    private aDominio(entity: ReservaEntity): Reserva {
        return Reserva.reconstruct({
            id: entity.id,
            autoId: entity.autoId,
            clienteId: entity.clienteId,
            fechaInicio: entity.fechaInicio,
            fechaFin: entity.fechaFin,
            fechaRetorno: entity.fechaRetorno,
            estado: entity.estado as any,
            precioTotal: entity.precioTotal,
            penalidad: entity.penalidad,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}