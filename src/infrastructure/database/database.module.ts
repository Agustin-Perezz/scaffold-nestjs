import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ormConfig } from '../../../mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(ormConfig)],
})
export class DatabaseModule {}
