/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';
import { Permission } from '../permission/permission.entity';
import moment from 'moment';
import { adminRole, roleDefault } from '@/constants';
import { UserDocument } from '../user/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel('Role') private roleModel: Model<Role>,
    @InjectModel('Permission') private permissionModel: Model<Permission>,
  ) {}
  onModuleInit() {
    this.initPackageEntity();
  }
  private readonly logger = new Logger(RoleService.name);
  async initPackageEntity() {
    try {
      for (const data of roleDefault) {
        const existingRole = await this.roleModel.findById(
          new Types.ObjectId(data._id),
        );
        if (!existingRole) {
          await this.roleModel.create(data);
        }
      }
      this.logger.verbose('Khởi tạo data cho role entity thành công');
    } catch (error) {
      this.logger.error('Không thể khởi tạo data cho role entity');
    }
  }
  async checkRole(name: string) {
    return await this.roleModel.findOne({ name });
  }
  async checkRoleById(id: string) {
    if (id === adminRole)
      throw new HttpException(
        {
          message: `You Don't Have Permission To Change Admin Role`,
          status: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
      );
    return await this.roleModel.findById(new Types.ObjectId(id));
  }
  async create(
    createRoleDto: CreateRoleDto,
    request: Request,
    userIp: string,
    user: UserDocument,
  ) {
    const { name } = createRoleDto;
    const checkRole = await this.roleModel.findOne({ name });
    if (checkRole)
      throw new HttpException(
        {
          message: 'Already Exist Role',
        },
        HttpStatus.BAD_REQUEST,
      );
    const role = await this.roleModel.create(createRoleDto);
    const newData = `Tên role: ${name}`;
    const stringLog = `${user?.username} vừa tạo mới 1 quyền hạn có tên ${role.name}`;
    request['new-data'] = newData;
    request['message-log'] = stringLog;
    return {
      statusCode: 200,
      message: 'Create Role Success',
      data: role,
    };
  }
  async update(
    id: Types.ObjectId,
    _role: UpdateRoleDto,
    request: Request,
    userIp: string,
    user: UserDocument,
  ) {
    if (id.toString() === adminRole)
      throw new HttpException(
        {
          message: `You Don't Have Permission To Change Admin Role`,
          status: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
      );
    const role = await this.roleModel.findById(new Types.ObjectId(id));
    if (!role)
      throw new HttpException(
        {
          message: 'Role By Id Is Not Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    const oldData = `Tên role: ${role.name}\n`;
    const checkName = await this.roleModel.findOne({
      name: _role.name,
    });
    if (checkName)
      throw new HttpException(
        {
          message: 'Role Name Already Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    role.name = _role.name;
    const newData = `Tên role: ${role.name}\n`;
    const stringLog = `${user?.username} vừa cập nhật thông tin cho role có tên ${role.name}`;
    request['new-data'] = newData;
    request['old-data'] = oldData;
    request['message-log'] = stringLog;
    await role.save();
    return {
      statusCode: 200,
      message: 'Update Role Success',
      data: role,
    };
  }
  async delete(
    id: Types.ObjectId,
    request: Request,
    userIp: string,
    user: UserDocument,
  ) {
    if (id.toString() === adminRole)
      throw new ForbiddenException({
        message: "You Don't Have Permission To Delete Admin Role",
      });
    const role = await this.roleModel.findByIdAndDelete(new Types.ObjectId(id));
    if (!role)
      throw new HttpException(
        {
          message: 'Role By Id Not Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    await this.permissionModel.deleteMany({
      role: new Types.ObjectId(id),
    });
    const stringLog = `💥Xóa quyền hạn💥\n\nNgười dùng ${user?.username} vừa xóa role có tên ${role.name}\n<b>Vào lúc</b>: ${moment(new Date()).format('HH:mm:ss DD-MM-YYYY')}\n<b>IP người thực hiện</b>: ${userIp}\n`;
    const oldData = `Tên role: ${role.name}\n`;
    request['old-data'] = oldData;
    request['message-log'] = stringLog;
    return {
      statusCode: 200,
      message: 'Role Deleted Successfully!',
    };
  }
  async getById(id: Types.ObjectId) {
    const role = await this.roleModel.findById(id);
    if (!role)
      throw new HttpException(
        {
          message: 'Role By Id Is Not Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    return {
      statusCode: 200,
      message: 'Get Role By Id Succes',
      data: role,
    };
  }
  async getAll() {
    const roles = await this.roleModel.find();
    return {
      statusCode: 200,
      message: 'Get List Role successfully',
      data: roles,
    };
  }
}
