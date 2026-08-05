import { Migration } from '@mikro-orm/migrations';

export class Migration20260805124644 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "authors" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "books" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "author_id" uuid not null, "isbn" varchar(255) not null, "publication_year" int not null, "genre" varchar(255) null, primary key ("id"));`,
    );
    this.addSql(`create index "books_title_index" on "books" ("title");`);
    this.addSql(`alter table "books" add constraint "books_isbn_unique" unique ("isbn");`);

    this.addSql(
      `alter table "books" add constraint "books_author_id_foreign" foreign key ("author_id") references "authors" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "books" drop constraint "books_author_id_foreign";`);

    this.addSql(`drop table if exists "authors" cascade;`);
    this.addSql(`drop table if exists "books" cascade;`);
  }
}
