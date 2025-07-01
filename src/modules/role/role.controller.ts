import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Authorization } from '@/decorators/authorization.decorator';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { ObjectIdValidationPipe } from '@/pipes/isValidObjectId.pipe';
import { Logging } from '@/decorators/logging.decorator';
import { UserDocument } from '../user/user.entity';
import { GetClientIP } from '@/decorators/userIp.decorator';
import { AuthUser } from '@/decorators/auth-user.decorator';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Authorization(SubjectEnum.ROLE, ActionEnum.READ)
  @Get('/get-all')
  async getAll() {
    return this.roleService.getAll();
  }
  @Authorization(SubjectEnum.ROLE, ActionEnum.READ)
  @Get('/:id')
  async getById(@Param('id', ObjectIdValidationPipe) id: Types.ObjectId) {
    return this.roleService.getById(id);
  }
  @Authorization(SubjectEnum.ROLE, ActionEnum.UPDATE)
  @Logging(
    'Cập nhật role có id: /id/',
    ActionLogEnum.UPDATE,
    SubjectEnum.ROLE,
    ['id'],
  )
  @Put('/:id')
  async update(
    @Body() role: UpdateRoleDto,
    @Param('id', ObjectIdValidationPipe) id: Types.ObjectId,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.roleService.update(id, role, request, userIp, user);
  }
  @Authorization(SubjectEnum.ROLE, ActionEnum.CREATE)
  @Logging('Tạo mới role', ActionLogEnum.CREATE, SubjectEnum.ROLE)
  @Post('')
  async create(
    @Body() role: CreateRoleDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.roleService.create(role, request, userIp, user);
  }
  @Authorization(SubjectEnum.ROLE, ActionEnum.DELETE)
  @Logging('Xóa role có id : /id/', ActionLogEnum.DELETE, SubjectEnum.ROLE, [
    'id',
  ])
  @Delete('/:id')
  async delete(
    @Param('id', ObjectIdValidationPipe) id: Types.ObjectId,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.roleService.delete(id, request, userIp, user);
  }
}
