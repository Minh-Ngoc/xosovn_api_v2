import { Module } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { SitemapController } from './sitemap.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';
import { Sitemap, SitemapSchema } from './sitemap.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sitemap.name, schema: SitemapSchema }]),
    UserModule,
    PermissionModule,
  ],
  controllers: [SitemapController],
  providers: [SitemapService],
  exports: [SitemapService],
})
export class SitemapModule {}
