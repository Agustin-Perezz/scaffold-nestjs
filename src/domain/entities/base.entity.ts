import { v7 as uuidv7 } from 'uuid';

export interface BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function generateBaseEntityProps(): Omit<BaseEntityProps, never> {
  const now = new Date();
  return {
    id: uuidv7(),
    createdAt: now,
    updatedAt: now,
  };
}

export abstract class BaseEntity {
  private readonly _id: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(props: BaseEntityProps) {
    this._id = props.id;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }
}
