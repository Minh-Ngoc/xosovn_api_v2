import { Module } from '@nestjs/common';
import { ApiXosoService } from './api-xoso.service';
import { ApiXosoController } from './api-xoso.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'http://103.213.8.29:8110/api/v1',
      timeout: 5000,
    }),
  ],
  controllers: [ApiXosoController],
  providers: [ApiXosoService],
  exports: [ApiXosoService],
})
export class ApiXosoModule {}
