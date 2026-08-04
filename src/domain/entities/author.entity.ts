import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export interface AuthorProperties extends BaseEntityProps {
  name: string;
}

export interface CreateAuthorParams {
  name: string;
}

export interface ReconstructAuthorParams extends BaseEntityProps {
  name: string;
}

export class Author extends BaseEntity {
  private _name: string;

  private constructor(props: AuthorProperties) {
    super(props);
    this._name = props.name;
  }

  static create(params: CreateAuthorParams): Author {
    return new Author({
      ...generateBaseEntityProps(),
      name: params.name,
    });
  }

  static reconstruct(params: ReconstructAuthorParams): Author {
    return new Author(params);
  }

  get name(): string {
    return this._name;
  }

  updateName(name: string): void {
    this._name = name;
    this.touch();
  }
}
