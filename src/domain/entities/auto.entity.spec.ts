import { Auto } from './auto.entity';

describe('Auto', () => {
  describe('create', () => {
    it('should create an auto with correct properties', () => {
      const params = {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2023,
        patente: 'ABC123',
        precioPorHora: 100,
      };

      const auto = Auto.create(params);

      expect(auto.id).toEqual(expect.any(String));
      expect(auto.marca).toBe('Toyota');
      expect(auto.modelo).toBe('Corolla');
      expect(auto.anio).toBe(2023);
      expect(auto.patente).toBe('ABC123');
      expect(auto.precioPorHora).toBe(100);
      expect(auto.disponible).toBe(true);
      expect(auto.createdAt).toBeInstanceOf(Date);
      expect(auto.updatedAt).toBeInstanceOf(Date);
    });

    it('should set disponible to true on creation', () => {
      const params = {
        marca: 'Ford',
        modelo: 'Focus',
        anio: 2022,
        patente: 'XYZ789',
        precioPorHora: 150,
      };

      const auto = Auto.create(params);

      expect(auto.disponible).toBe(true);
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct an auto with all properties preserved', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-15');
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        marca: 'Honda',
        modelo: 'Civic',
        anio: 2021,
        patente: 'DEF456',
        precioPorHora: 120,
        disponible: false,
        createdAt,
        updatedAt,
      };

      const auto = Auto.reconstruct(params);

      expect(auto.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(auto.marca).toBe('Honda');
      expect(auto.modelo).toBe('Civic');
      expect(auto.anio).toBe(2021);
      expect(auto.patente).toBe('DEF456');
      expect(auto.precioPorHora).toBe(120);
      expect(auto.disponible).toBe(false);
      expect(auto.createdAt).toBe(createdAt);
      expect(auto.updatedAt).toBe(updatedAt);
    });

    it('should preserve disponible as true when reconstructed', () => {
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        marca: 'Chevrolet',
        modelo: 'Onix',
        anio: 2023,
        patente: 'GHI789',
        precioPorHora: 90,
        disponible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const auto = Auto.reconstruct(params);

      expect(auto.disponible).toBe(true);
    });
  });

  describe('activar', () => {
    it('should set disponible to true', () => {
      const auto = Auto.create({
        marca: 'Volkswagen',
        modelo: 'Golf',
        anio: 2022,
        patente: 'JKL012',
        precioPorHora: 130,
      });

      auto.desactivar();
      expect(auto.disponible).toBe(false);

      auto.activar();
      expect(auto.disponible).toBe(true);
    });

    it('should update updatedAt when activated', () => {
      const auto = Auto.create({
        marca: 'Peugeot',
        modelo: '208',
        anio: 2023,
        patente: 'MNO345',
        precioPorHora: 110,
      });

      const initialUpdatedAt = auto.updatedAt;
      auto.activar();

      expect(auto.updatedAt).not.toBe(initialUpdatedAt);
      expect(auto.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('desactivar', () => {
    it('should set disponible to false', () => {
      const auto = Auto.create({
        marca: 'Renault',
        modelo: 'Clio',
        anio: 2021,
        patente: 'PQR678',
        precioPorHora: 80,
      });

      expect(auto.disponible).toBe(true);

      auto.desactivar();

      expect(auto.disponible).toBe(false);
    });

    it('should update updatedAt when deactivated', () => {
      const auto = Auto.create({
        marca: 'Citroen',
        modelo: 'C3',
        anio: 2022,
        patente: 'STU901',
        precioPorHora: 85,
      });

      const initialUpdatedAt = auto.updatedAt;
      auto.desactivar();

      expect(auto.updatedAt).not.toBe(initialUpdatedAt);
      expect(auto.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('actualizarPrecio', () => {
    it('should update precioPorHora when price is positive', () => {
      const auto = Auto.create({
        marca: 'Fiat',
        modelo: 'Cronos',
        anio: 2023,
        patente: 'VWX234',
        precioPorHora: 100,
      });

      auto.actualizarPrecio(150);

      expect(auto.precioPorHora).toBe(150);
    });

    it('should update updatedAt when price is updated', () => {
      const auto = Auto.create({
        marca: 'Nissan',
        modelo: 'Versa',
        anio: 2022,
        patente: 'YZA567',
        precioPorHora: 100,
      });

      const initialUpdatedAt = auto.updatedAt;
      auto.actualizarPrecio(200);

      expect(auto.updatedAt).not.toBe(initialUpdatedAt);
    });

    it('should throw error when price is zero', () => {
      const auto = Auto.create({
        marca: 'Mazda',
        modelo: '3',
        anio: 2023,
        patente: 'BCD890',
        precioPorHora: 100,
      });

      expect(() => auto.actualizarPrecio(0)).toThrow('El precio por hora debe ser mayor a cero');
    });

    it('should throw error when price is negative', () => {
      const auto = Auto.create({
        marca: 'Subaru',
        modelo: 'Impreza',
        anio: 2021,
        patente: 'EFG123',
        precioPorHora: 100,
      });

      expect(() => auto.actualizarPrecio(-50)).toThrow('El precio por hora debe ser mayor a cero');
    });

    it('should not update precioPorHora when price is invalid', () => {
      const auto = Auto.create({
        marca: 'Hyundai',
        modelo: 'Tucson',
        anio: 2023,
        patente: 'HIJ456',
        precioPorHora: 100,
      });

      expect(() => auto.actualizarPrecio(-10)).toThrow();
      expect(auto.precioPorHora).toBe(100);
    });
  });

  describe('actualizarMarcaYModelo', () => {
    it('should update marca and modelo', () => {
      const auto = Auto.create({
        marca: 'Kia',
        modelo: 'Sportage',
        anio: 2022,
        patente: 'KLM789',
        precioPorHora: 120,
      });

      auto.actualizarMarcaYModelo('Jeep', 'Compass');

      expect(auto.marca).toBe('Jeep');
      expect(auto.modelo).toBe('Compass');
    });

    it('should update updatedAt when marca and modelo are changed', () => {
      const auto = Auto.create({
        marca: 'Suzuki',
        modelo: 'Vitara',
        anio: 2021,
        patente: 'NOP012',
        precioPorHora: 95,
      });

      const initialUpdatedAt = auto.updatedAt;
      auto.actualizarMarcaYModelo('Suzuki', 'S-Cross');

      expect(auto.updatedAt).not.toBe(initialUpdatedAt);
    });

    it('should allow updating only one field via marca y modelo', () => {
      const auto = Auto.create({
        marca: 'Toyota',
        modelo: 'Yaris',
        anio: 2023,
        patente: 'QRS345',
        precioPorHora: 110,
      });

      auto.actualizarMarcaYModelo('Toyota', 'Hilux');

      expect(auto.marca).toBe('Toyota');
      expect(auto.modelo).toBe('Hilux');
    });
  });

  describe('actualizarAnio', () => {
    it('should update anio', () => {
      const auto = Auto.create({
        marca: 'Mitsubishi',
        modelo: 'L200',
        anio: 2022,
        patente: 'TUV678',
        precioPorHora: 140,
      });

      auto.actualizarAnio(2024);

      expect(auto.anio).toBe(2024);
    });

    it('should update updatedAt when anio is changed', () => {
      const auto = Auto.create({
        marca: 'Dodge',
        modelo: 'Ram',
        anio: 2021,
        patente: 'WXY901',
        precioPorHora: 160,
      });

      const initialUpdatedAt = auto.updatedAt;
      auto.actualizarAnio(2023);

      expect(auto.updatedAt).not.toBe(initialUpdatedAt);
    });
  });

  describe('getters', () => {
    it('should return correct id via getter', () => {
      const auto = Auto.create({
        marca: 'Tesla',
        modelo: 'Model 3',
        anio: 2023,
        patente: 'ZAB234',
        precioPorHora: 200,
      });

      expect(auto.id).toEqual(expect.any(String));
    });

    it('should return correct marca via getter', () => {
      const auto = Auto.create({
        marca: 'BMW',
        modelo: 'X1',
        anio: 2022,
        patente: 'CDE567',
        precioPorHora: 180,
      });

      expect(auto.marca).toBe('BMW');
    });

    it('should return correct modelo via getter', () => {
      const auto = Auto.create({
        marca: 'Mercedes',
        modelo: 'A-Class',
        anio: 2023,
        patente: 'FGH890',
        precioPorHora: 190,
      });

      expect(auto.modelo).toBe('A-Class');
    });

    it('should return correct anio via getter', () => {
      const auto = Auto.create({
        marca: 'Audi',
        modelo: 'A4',
        anio: 2021,
        patente: 'IJK123',
        precioPorHora: 170,
      });

      expect(auto.anio).toBe(2021);
    });

    it('should return correct patente via getter', () => {
      const auto = Auto.create({
        marca: 'Volvo',
        modelo: 'XC60',
        anio: 2022,
        patente: 'LMN456',
        precioPorHora: 175,
      });

      expect(auto.patente).toBe('LMN456');
    });

    it('should return correct precioPorHora via getter', () => {
      const auto = Auto.create({
        marca: 'Porsche',
        modelo: '911',
        anio: 2023,
        patente: 'OPQ789',
        precioPorHora: 300,
      });

      expect(auto.precioPorHora).toBe(300);
    });

    it('should return correct disponible via getter', () => {
      const auto = Auto.create({
        marca: 'Ferrari',
        modelo: '488',
        anio: 2022,
        patente: 'RST012',
        precioPorHora: 500,
      });

      expect(auto.disponible).toBe(true);

      auto.desactivar();
      expect(auto.disponible).toBe(false);
    });

    it('should return correct createdAt via getter', () => {
      const beforeCreate = new Date();
      const auto = Auto.create({
        marca: 'Lamborghini',
        modelo: 'Huracan',
        anio: 2023,
        patente: 'UVW345',
        precioPorHora: 600,
      });
      const afterCreate = new Date();

      expect(auto.createdAt).toBeInstanceOf(Date);
      expect(auto.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(auto.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should return correct updatedAt via getter', () => {
      const auto = Auto.create({
        marca: 'Maserati',
        modelo: 'Ghibli',
        anio: 2022,
        patente: 'XYZ678',
        precioPorHora: 350,
      });

      expect(auto.updatedAt).toBeInstanceOf(Date);
    });
  });
});
