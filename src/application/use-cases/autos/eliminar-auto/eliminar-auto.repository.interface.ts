import { Auto } from '../../../../domain/entities/auto.entity';

export interface IEliminarAutoRepository {
  obtenerPorId(id: string): Promise<Auto | null>;
  eliminar(id: string): Promise<void>;
}
