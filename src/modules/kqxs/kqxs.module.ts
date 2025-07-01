import { forwardRef, Module } from '@nestjs/common';
import { KqxsService } from './kqxs.service';
import { KqxsController } from './kqxs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Kqxs, KqxsSchema } from './kqxs.entity';
import { ProvinceModule } from '../province/province.module';
import { ApiXosoModule } from '../api-xoso/api-xoso.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Kqxs.name, schema: KqxsSchema }],
      Kqxs.name,
    ),
    forwardRef(() => ProvinceModule),
    forwardRef(() => ApiXosoModule),
  ],
  controllers: [KqxsController],
  providers: [KqxsService],
})
export class KqxsModule {}
