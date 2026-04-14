import { Auto } from '../../../../domain/entities/auto.entity';

export interface ICrearAutoRepository {
  crear(auto: Auto): Promise<Auto>;
  existePorPatente(patente: string): Promise<boolean>;
}
