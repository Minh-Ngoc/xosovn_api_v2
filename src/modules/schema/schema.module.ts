import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, SchemaSchema } from './schema.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schema.name, schema: SchemaSchema }]),
    UserModule,
    PermissionModule,
  ],
  controllers: [SchemaController],
  providers: [SchemaService],
  exports: [SchemaService],
})
export class SchemaModule {}
