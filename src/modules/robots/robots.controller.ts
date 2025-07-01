import { Body, Controller, Get, Post } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { Authorization } from '@/decorators/authorization.decorator';
import { HttpStatusCode } from 'axios';

@Controller('robots')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Get()
  @ResponseMessage('Get Robot.txt Success')
  getRobots() {
    return this.robotsService.getRobotsContent();
  }

  @Authorization(SubjectEnum.ROBOT, ActionEnum.UPDATE)
  @Post()
  @ResponseMessage('Update Robot.txt Success', HttpStatusCode.Ok)
  @Logging('Cập nhật file Robot.txt', ActionLogEnum.UPDATE, SubjectEnum.ROBOT)
  updateRobots(@Body('content') content: string) {
    return this.robotsService.updateRobotsContent(content);
  }
}
