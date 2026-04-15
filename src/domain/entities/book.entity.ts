import { v7 as uuidv7 } from 'uuid';

export interface BookProperties {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publicationYear: number;
    genre: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookParams {
    title: string;
    author: string;
    isbn: string;
    publicationYear: number;
    genre?: string | null;
}

export interface ReconstructBookParams {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publicationYear: number;
    genre: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Book {
    private readonly _id: string;
    private _title: string;
    private _author: string;
    private readonly _isbn: string;
    private _publicationYear: number;
    private _genre: string | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: BookProperties) {
        this._id = props.id;
        this._title = props.title;
        this._author = props.author;
        this._isbn = props.isbn;
        this._publicationYear = props.publicationYear;
        this._genre = props.genre;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(params: CreateBookParams): Book {
        const now = new Date();
        return new Book({
            id: uuidv7(),
            title: params.title,
            author: params.author,
            isbn: params.isbn,
            publicationYear: params.publicationYear,
            genre: params.genre ?? null,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstruct(params: ReconstructBookParams): Book {
        return new Book({
            id: params.id,
            title: params.title,
            author: params.author,
            isbn: params.isbn,
            publicationYear: params.publicationYear,
            genre: params.genre,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt,
        });
    }

    get id(): string {
        return this._id;
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

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateTitle(title: string): void {
        this._title = title;
        this._updatedAt = new Date();
    }

    updateAuthor(author: string): void {
        this._author = author;
        this._updatedAt = new Date();
    }

    updatePublicationYear(year: number): void {
        this._publicationYear = year;
        this._updatedAt = new Date();
    }

    updateGenre(genre: string | null): void {
        this._genre = genre;
        this._updatedAt = new Date();
    }
}
