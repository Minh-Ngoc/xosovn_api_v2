import { Controller, Get, Query } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Controller('logs')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.loggerService.findAllPaginated(query);
  }
}
