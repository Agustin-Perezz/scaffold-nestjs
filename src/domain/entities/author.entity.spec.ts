import { Author } from './author.entity';

describe('Author Entity', () => {
  describe('create', () => {
    it('creates an author with name and base entity props', () => {
      const author = Author.create({ name: 'Andrew Hunt' });

      expect(author.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(author.name).toBe('Andrew Hunt');
      expect(author.createdAt).toBeInstanceOf(Date);
      expect(author.updatedAt).toBeInstanceOf(Date);
      expect(author.createdAt.getTime()).toBe(author.updatedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000000';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');

      const author = Author.reconstruct({ id, name: 'Robert Martin', createdAt, updatedAt });

      expect(author.id).toBe(id);
      expect(author.createdAt).toBe(createdAt);
      expect(author.updatedAt).toBe(updatedAt);
      expect(author.name).toBe('Robert Martin');
    });
  });

  describe('updateName', () => {
    it('mutates name and advances updatedAt', async () => {
      const author = Author.create({ name: 'Old Name' });
      const originalUpdatedAt = author.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      author.updateName('New Name');

      expect(author.name).toBe('New Name');
      expect(author.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
