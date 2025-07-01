import { forwardRef, Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Social, SocialSchema } from './social.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Social.name, schema: SocialSchema }]),
    UserModule,
    PermissionModule,
    forwardRef(() => StorageModule),
  ],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}
