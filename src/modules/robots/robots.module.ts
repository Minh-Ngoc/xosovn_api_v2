import { forwardRef, Module } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { RobotsController } from './robots.controller';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [forwardRef(() => StorageModule), UserModule, PermissionModule],
  controllers: [RobotsController],
  providers: [RobotsService],
})
export class RobotsModule {}
