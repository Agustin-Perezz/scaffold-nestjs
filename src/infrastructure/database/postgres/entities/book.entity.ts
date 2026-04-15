import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/postgresql';
import { v7 as uuidv7 } from 'uuid';

@Entity({ tableName: 'books' })
export class BookEntity {
    @PrimaryKey()
    id: string = uuidv7();

    @Index()
    @Property()
    title: string;

    @Property()
    author: string;

    @Property({ unique: true })
    isbn: string;

    @Property()
    publicationYear: number;

    @Property({ nullable: true })
    genre: string | null = null;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    constructor(title: string, author: string, isbn: string, publicationYear: number) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publicationYear = publicationYear;
    }
}
