import { Cliente } from './cliente.entity';

describe('Cliente', () => {
  describe('create', () => {
    it('should create a cliente with all properties set correctly', () => {
      const params = {
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      };

      const cliente = Cliente.create(params);

      expect(cliente.id).toBeDefined();
      expect(cliente.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(cliente.nombre).toBe('Juan');
      expect(cliente.apellido).toBe('Perez');
      expect(cliente.dni).toBe('12345678');
      expect(cliente.telefono).toBe('1234567890');
      expect(cliente.email).toBe('juan@example.com');
      expect(cliente.createdAt).toBeInstanceOf(Date);
      expect(cliente.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a cliente with email set to null when not provided', () => {
      const params = {
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
      };

      const cliente = Cliente.create(params);

      expect(cliente.email).toBeNull();
    });

    it('should create a cliente with email set to null when explicitly null', () => {
      const params = {
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: null,
      };

      const cliente = Cliente.create(params);

      expect(cliente.email).toBeNull();
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct a cliente with all properties preserved', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Maria',
        apellido: 'Gomez',
        dni: '87654321',
        telefono: '0987654321',
        email: 'maria@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(cliente.nombre).toBe('Maria');
      expect(cliente.apellido).toBe('Gomez');
      expect(cliente.dni).toBe('87654321');
      expect(cliente.telefono).toBe('0987654321');
      expect(cliente.email).toBe('maria@example.com');
      expect(cliente.createdAt).toBe(now);
      expect(cliente.updatedAt).toBe(now);
    });

    it('should reconstruct a cliente with null email', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Maria',
        apellido: 'Gomez',
        dni: '87654321',
        telefono: '0987654321',
        email: null,
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.email).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return correct id value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should return correct nombre value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.nombre).toBe('Juan');
    });

    it('should return correct apellido value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.apellido).toBe('Perez');
    });

    it('should return correct dni value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.dni).toBe('12345678');
    });

    it('should return correct telefono value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.telefono).toBe('1234567890');
    });

    it('should return correct email value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.email).toBe('juan@example.com');
    });

    it('should return correct createdAt value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.createdAt).toBe(now);
    });

    it('should return correct updatedAt value', () => {
      const now = new Date();
      const params = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      };

      const cliente = Cliente.reconstruct(params);

      expect(cliente.updatedAt).toBe(now);
    });
  });

  describe('dni is readonly', () => {
    it('should have dni getter but no setter', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      expect(cliente.dni).toBe('12345678');

      expect(Object.getOwnPropertyDescriptor(cliente, 'dni')).toBeUndefined();
      expect(Object.getOwnPropertyDescriptor(Cliente.prototype, 'dni')).toBeDefined();
    });
  });

  describe('actualizarContacto', () => {
    it('should update telefono and email when both provided', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      const originalUpdatedAt = cliente.updatedAt;
      cliente.actualizarContacto('0987654321', 'nuevo@example.com');

      expect(cliente.telefono).toBe('0987654321');
      expect(cliente.email).toBe('nuevo@example.com');
      expect(cliente.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should update only telefono when email not provided', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      cliente.actualizarContacto('0987654321');

      expect(cliente.telefono).toBe('0987654321');
      expect(cliente.email).toBe('juan@example.com');
    });

    it('should update telefono and set email to null when null provided', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      cliente.actualizarContacto('0987654321', null);

      expect(cliente.telefono).toBe('0987654321');
      expect(cliente.email).toBeNull();
    });
  });

  describe('actualizarEmail', () => {
    it('should update email to a new string value', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      const originalUpdatedAt = cliente.updatedAt;
      cliente.actualizarEmail('nuevo@example.com');

      expect(cliente.email).toBe('nuevo@example.com');
      expect(cliente.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should update email to null', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      const originalUpdatedAt = cliente.updatedAt;
      cliente.actualizarEmail(null);

      expect(cliente.email).toBeNull();
      expect(cliente.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('actualizarNombre', () => {
    it('should update nombre correctly', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      const originalUpdatedAt = cliente.updatedAt;
      cliente.actualizarNombre('Carlos');

      expect(cliente.nombre).toBe('Carlos');
      expect(cliente.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('actualizarApellido', () => {
    it('should update apellido correctly', () => {
      const cliente = Cliente.create({
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        telefono: '1234567890',
        email: 'juan@example.com',
      });

      const originalUpdatedAt = cliente.updatedAt;
      cliente.actualizarApellido('Gomez');

      expect(cliente.apellido).toBe('Gomez');
      expect(cliente.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });
});
