import { defineEntity, p } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

export const BaseEntitySchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: p.uuid().primary(),
    createdAt: p.datetime(),
    updatedAt: p.datetime().onUpdate(() => new Date()),
  },
});

export class BaseEntity extends BaseEntitySchema.class {
  id = uuidv7();
  createdAt = new Date();
  updatedAt = new Date();
}

BaseEntitySchema.setClass(BaseEntity);
