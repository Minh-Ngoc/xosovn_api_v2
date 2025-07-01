import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Authentication } from 'src/decorators/authentication.decorator';
import { Logging } from 'src/decorators/logging.decorator';
import { ActionEnum, ActionLogEnum, SubjectEnum } from 'src/enums';
import { Authorization } from 'src/decorators/authorization.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { GetPaginationUsers } from './dto/get-pagination-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './user.entity';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResponseMessage } from '@/decorators/response-message.decorator';

@Controller('users')
export class UserController {
  @Authorization()
  @Logging(
    'Người dùng đổi mật khẩu',
    ActionLogEnum.CHANGE_PASSWORD,
    SubjectEnum.USER,
  )
  @Put('/password')
  @ResponseMessage('Đổi mật khẩu thành công!')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @Req() request: Request,
    @AuthUser() user: UserDocument,
  ) {
    return this.userService.updatePassword(body, user, request);
  }

  constructor(private readonly userService: UserService) {}
  @Authorization(SubjectEnum.USER, ActionEnum.CREATE)
  @Logging('Tạo mới người dùng', ActionLogEnum.CREATE, SubjectEnum.USER)
  @Post('/')
  async createNewUser(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }
  @Authentication()
  @Get('/get-all')
  async getAllUser() {
    return this.userService.getAllUser();
  }

  @Authorization(SubjectEnum.USER, ActionEnum.READ)
  @Get('/:id')
  async getUserById(@Param() id: string) {
    return this.userService.getUserById(id);
  }

  @Authorization(SubjectEnum.USER, ActionEnum.READ)
  @Get('/')
  async getPaginationUser(@Query() query: GetPaginationUsers) {
    return this.userService.getPaginationUser(query);
  }

  @Authorization(SubjectEnum.USER, ActionEnum.UPDATE)
  @Logging(
    'Cập nhật người dùng có id: /id/',
    ActionLogEnum.UPDATE,
    SubjectEnum.USER,
    ['id'],
  )
  @Put('/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, updateUser);
  }

  @Authorization(SubjectEnum.USER, ActionEnum.DELETE)
  @Logging(
    'Xóa người dùng có id : /id/',
    ActionLogEnum.DELETE,
    SubjectEnum.USER,
    ['id'],
  )
  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
