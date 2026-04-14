import { Auto } from '../../../../domain/entities/auto.entity';

export interface IObtenerAutoRepository {
  obtenerPorId(id: string): Promise<Auto | null>;
}
