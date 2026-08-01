import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export interface BookProperties extends BaseEntityProps {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  genre: string | null;
}

export interface CreateBookParams {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  genre?: string | null;
}

export interface ReconstructBookParams extends BaseEntityProps {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  genre: string | null;
}

export class Book extends BaseEntity {
  private _title: string;
  private _author: string;
  private readonly _isbn: string;
  private _publicationYear: number;
  private _genre: string | null;

  private constructor(props: BookProperties) {
    super(props);
    this._title = props.title;
    this._author = props.author;
    this._isbn = props.isbn;
    this._publicationYear = props.publicationYear;
    this._genre = props.genre;
  }

  static create(params: CreateBookParams): Book {
    return new Book({
      ...generateBaseEntityProps(),
      title: params.title,
      author: params.author,
      isbn: params.isbn,
      publicationYear: params.publicationYear,
      genre: params.genre ?? null,
    });
  }

  static reconstruct(params: ReconstructBookParams): Book {
    return new Book(params);
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get isbn(): string {
    return this._isbn;
  }

  get publicationYear(): number {
    return this._publicationYear;
  }

  get genre(): string | null {
    return this._genre;
  }

  updateTitle(title: string): void {
    this._title = title;
    this.touch();
  }

  updateAuthor(author: string): void {
    this._author = author;
    this.touch();
  }

  updatePublicationYear(year: number): void {
    this._publicationYear = year;
    this.touch();
  }

  updateGenre(genre: string | null): void {
    this._genre = genre;
    this.touch();
  }
}
