import { Auto } from '../../../../domain/entities/auto.entity';

export interface IActualizarAutoRepository {
  obtenerPorId(id: string): Promise<Auto | null>;
  existePorPatente(patente: string, excludeId?: string): Promise<boolean>;
  guardar(auto: Auto): Promise<Auto>;
}
