import { Module } from '@nestjs/common';
import { SoMoService } from './so-mo.service';
import { SoMoController } from './so-mo.controller';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SoMo, SoMoSchema } from './so-mo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SoMo.name, schema: SoMoSchema }]),
    UserModule,
    PermissionModule,
  ],
  controllers: [SoMoController],
  providers: [SoMoService],
})
export class SoMoModule {}
