import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VietlottController } from './vietlott.controller';
import { VietlottService } from './vietlott.service';
import { Max3D, Max3DSchema } from './entities/max3d.entity';
import { Max3DPro, Max3DProSchema } from './entities/max3d-pro.entity';
import { Mega645, Mega645Schema } from './entities/mega-645.entity';
import { Power655, Power655Schema } from './entities/power-655.entity';

export const vietlottEntities = [
  { name: Max3D.name, schema: Max3DSchema },
  { name: Max3DPro.name, schema: Max3DProSchema },
  { name: Mega645.name, schema: Mega645Schema },
  { name: Power655.name, schema: Power655Schema },
];

@Module({
  imports: [
    ...vietlottEntities.map(({ name, schema }) =>
      MongooseModule.forFeature([{ name, schema }], name),
    ),
  ],
  controllers: [VietlottController],
  providers: [VietlottService],
  exports: [VietlottService],
})
export class VietlottModule {}
