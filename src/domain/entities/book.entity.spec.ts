import { Book } from './book.entity';

describe('Book Entity', () => {
  const validParams = {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '978-0135957059',
    publicationYear: 1999,
  };

  describe('create', () => {
    it('creates a book with all fields and base entity props', () => {
      const book = Book.create({ ...validParams, genre: 'Software Engineering' });

      expect(book.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(book.title).toBe('The Pragmatic Programmer');
      expect(book.author).toBe('Andrew Hunt');
      expect(book.isbn).toBe('978-0135957059');
      expect(book.publicationYear).toBe(1999);
      expect(book.genre).toBe('Software Engineering');
      expect(book.createdAt).toBeInstanceOf(Date);
      expect(book.updatedAt).toBeInstanceOf(Date);
      expect(book.createdAt.getTime()).toBe(book.updatedAt.getTime());
    });

    it('defaults genre to null when not provided', () => {
      const book = Book.create(validParams);

      expect(book.genre).toBeNull();
    });

    it('defaults genre to null when explicitly undefined', () => {
      const book = Book.create({ ...validParams, genre: undefined });

      expect(book.genre).toBeNull();
    });

    it('accepts an explicit null genre', () => {
      const book = Book.create({ ...validParams, genre: null });

      expect(book.genre).toBeNull();
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000000';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');

      const book = Book.reconstruct({
        id,
        title: 'Clean Code',
        author: 'Robert Martin',
        isbn: '978-0132350884',
        publicationYear: 2008,
        genre: 'Programming',
        createdAt,
        updatedAt,
      });

      expect(book.id).toBe(id);
      expect(book.createdAt).toBe(createdAt);
      expect(book.updatedAt).toBe(updatedAt);
      expect(book.title).toBe('Clean Code');
    });
  });

  describe('update methods', () => {
    it('updateTitle mutates title and advances updatedAt', async () => {
      const book = Book.create(validParams);
      const originalUpdatedAt = book.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      book.updateTitle('New Title');

      expect(book.title).toBe('New Title');
      expect(book.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('updateAuthor mutates author and advances updatedAt', async () => {
      const book = Book.create(validParams);
      const originalUpdatedAt = book.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      book.updateAuthor('New Author');

      expect(book.author).toBe('New Author');
      expect(book.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('updatePublicationYear mutates year and advances updatedAt', async () => {
      const book = Book.create(validParams);

      await new Promise((r) => setTimeout(r, 5));
      book.updatePublicationYear(2024);

      expect(book.publicationYear).toBe(2024);
      expect(book.updatedAt.getTime()).toBeGreaterThan(book.createdAt.getTime());
    });

    it('updateGenre mutates genre and advances updatedAt', async () => {
      const book = Book.create(validParams);

      await new Promise((r) => setTimeout(r, 5));
      book.updateGenre('New Genre');

      expect(book.genre).toBe('New Genre');
      expect(book.updatedAt.getTime()).toBeGreaterThan(book.createdAt.getTime());
    });

    it('updateGenre accepts null', () => {
      const book = Book.create({ ...validParams, genre: 'Programming' });

      book.updateGenre(null);

      expect(book.genre).toBeNull();
    });
  });
});
