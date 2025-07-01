import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TaxonomyModule } from './modules/taxonomy/taxonomy.module';
import { StorageModule } from './modules/storage/storage.module';
import { PostModule } from './modules/post/post.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MenuModule } from './modules/menu/menu.module';
import { SchemaModule } from './modules/schema/schema.module';
import { PageModule } from './modules/page/page.module';
import { FOLDER_UPLOAD_IMAGES } from './constants';
import { SitemapModule } from './modules/sitemap/sitemap.module';
import {
  vietlottEntities,
  VietlottModule,
} from './modules/vietlott/vietlott.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Kqxs, KqxsSchema } from './modules/kqxs/kqxs.entity';
import { Province, ProvinceSchema } from './modules/province/province.entity';
import { KqxsModule } from './modules/kqxs/kqxs.module';
import { ProvinceModule } from './modules/province/province.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggerModule } from './modules/logger/logger.module';
import { SocialModule } from './modules/social/social.module';
import { RobotsModule } from './modules/robots/robots.module';
import { SoMoModule } from './modules/so-mo/so-mo.module';
import { ApiXosoModule } from './modules/api-xoso/api-xoso.module';

const xosoEntities = [
  ...vietlottEntities,
  { name: Kqxs.name, schema: KqxsSchema },
  { name: Province.name, schema: ProvinceSchema },
];

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_ACCESS_TOKEN_JWT },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      connectionFactory: (connection) => {
        const mongoLogger = new Logger('DATABASE');
        connection.on('connected', () => {
          mongoLogger.verbose('Kết nối cơ sở dữ liệu thành công');
        });
        connection._events.connected();
        return connection;
      },
    }),
    // Vietlott
    ...xosoEntities.map((entity) =>
      MongooseModule.forRoot(process.env.MONGO_URL_XOSO, {
        connectionName: entity.name,
        connectionFactory: (connection) => {
          const logger = new Logger(entity.name);
          connection.on('connected', () => {
            logger.verbose(`Kết nối ${entity.name} thành công`);
          });
          return connection;
        },
      }),
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', FOLDER_UPLOAD_IMAGES), // path to folder
      serveRoot: '/images', // public route: http://host/images/filename.jpg
    }),
    CacheModule.register({
      ttl: 1800, // 30 phút
      max: 100, // số lượng keys tối đa (tuỳ chọn)
      isGlobal: true, // nếu muốn dùng toàn app
    }),
    StorageModule,
    UserModule,
    PermissionModule,
    RoleModule,
    AuthModule,
    TaxonomyModule,
    PostModule,
    MenuModule,
    SchemaModule,
    PageModule,
    SitemapModule,
    SocialModule,
    VietlottModule,
    KqxsModule,
    ProvinceModule,
    LoggerModule,
    RobotsModule,
    SoMoModule,
    ApiXosoModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
