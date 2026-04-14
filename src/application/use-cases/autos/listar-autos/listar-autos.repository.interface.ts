import { Auto } from '../../../../domain/entities/auto.entity';

export interface IListarAutosRepository {
  listarTodos(): Promise<Auto[]>;
  listarDisponibles(): Promise<Auto[]>;
}
