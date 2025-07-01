import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger, LoggerSchema } from './logger.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: LoggerSchema, name: Logger.name }]),
  ],
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
