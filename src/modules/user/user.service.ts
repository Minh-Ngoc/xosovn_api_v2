import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionService } from '../permission/permission.service';
import { User, UserDocument } from './user.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { usersDefault } from '@/constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetPaginationUsers } from './dto/get-pagination-users.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly permissionService: PermissionService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async onModuleInit() {
    try {
      for (const user of usersDefault) {
        const checkUser = await this.userModel.findOne({
          $or: [
            {
              _id: new Types.ObjectId(user._id),
            },
            {
              username: user?.username,
            },
          ],
        });

        if (checkUser) continue;
        await this.userModel.create({
          ...user,
          role: new Types.ObjectId(user.role),
          _id: new Types.ObjectId(user._id),
        });
      }

      this.logger.verbose(
        'Khởi tạo người dùng mặc định cho hệ thống thành công!',
      );
    } catch (error) {
      console.log('error: ', error);

      this.logger.error('Khởi tạo người dùng mặc định cho hệ thống thất bại!');
    }
  }

  async findOneBy(filter: FilterQuery<UserDocument>) {
    return await this.userModel.findOne(filter);
  }

  async findOneById(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));

      return user;
    } catch (error) {
      console.log('error: ', error);
      return false;
    }
  }

  async checkUsername(username: string) {
    const user = await this.userModel.findOne({ username });

    return user;
  }

  async getUserById(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      .populate([{ path: 'role', select: '_id name' }]);

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const findPermission = await this.permissionService.getPermissionByRole(
      user?.role?._id,
    );

    return {
      ...user?.toObject(),
      permission: findPermission,
    };
  }

  async checkPassword(password: string, hashPassword: string) {
    const isCorrectPassword = await bcrypt.compare(password, hashPassword);
    return isCorrectPassword;
  }

  async checkEmail(email: string) {
    const user = await this.userModel.findOne({ email, isDeleted: false });

    return user;
  }

  async getUserByIdAuthGuard(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      .populate('role');
    const findPermission = await this.permissionService.getPermissionByRole(
      user.role._id,
    );

    return {
      ...user.toObject(),
      permission: findPermission,
    };
  }

  async findUserByToken(refresh_token: string) {
    return await this.userModel
      .findOne({
        refresh_token,
      })
      .populate({
        path: 'role',
        select: {
          name: 1,
        },
      });
  }

  async updateRefreshToken({ refresh_token, _id }) {
    return await this.userModel.findOneAndUpdate(
      { _id },
      { refresh_token },
      { new: true },
    );
  }

  async getPaginationUser(query: GetPaginationUsers) {
    const { pageIndex, pageSize, search } = query;

    const limit = pageSize ? pageSize : null;
    const skip = pageIndex ? pageSize * (pageIndex - 1) : null;
    const filter: any = {};

    if (search) {
      filter['$or'] = [
        {
          name: new RegExp(search.toString(), 'i'),
        },
        {
          username: new RegExp(search.toString(), 'i'),
        },
      ];
    }

    const [total, users] = await Promise.all([
      this.userModel.countDocuments({ ...filter, isDeleted: false }),
      this.userModel
        .find({
          ...filter,
          isDeleted: false,
        })
        .sort({ createdAt: -1 })
        .populate([{ path: 'role', select: 'name' }])
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      statusCode: 200,
      message: 'Get Paging User Success',
      total,
      users,
      totalPages,
    };
  }

  async getAllUser() {
    const users = await this.userModel.find({ isDeleted: false });
    return {
      statusCode: 200,
      message: 'Get All User Success',
      data: users,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 10);

    const alreadyUsername = await this.checkUsername(createUserDto?.username);

    if (alreadyUsername) {
      throw new HttpException(
        {
          statusCode: 5,
          message: 'Already Exist Username!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createUserDto?.email) {
      const alreadyEmail = await this.checkEmail(createUserDto?.email);

      if (alreadyEmail) {
        throw new HttpException(
          {
            statusCode: 6,
            message: 'Already Exist Email!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      role: new Types.ObjectId(createUserDto?.role),
    });

    const user = await this.userModel
      .findById(newUser?._id)
      .populate([{ path: 'role', select: 'name' }]);

    return {
      statusCode: 201,
      user,
    };
  }

  async updateUserById(id: string, updateUser: UpdateUserDto) {
    const user = await this.userModel.findById(new Types.ObjectId(id));

    if (!user) {
      throw new HttpException(
        {
          message: 'User Id Is Not Found!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const alreadyUsername = await this.checkUsername(updateUser?.username);

    if (alreadyUsername && alreadyUsername?.username !== user?.username) {
      throw new HttpException(
        {
          message: 'Already Exist Username!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const alreadyEmail = await this.checkEmail(updateUser?.email);

    if (alreadyEmail && alreadyEmail?.email !== user?.email) {
      throw new HttpException(
        {
          message: 'Already Exist Email!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const udUser = await this.userModel
      .findByIdAndUpdate(
        user?._id,
        {
          ...updateUser,
          role: new Types.ObjectId(updateUser?.role),
        },
        {
          new: true,
        },
      )
      .populate([{ path: 'role', select: 'name' }]);
    return {
      statusCode: 200,
      message: 'Update User Success',
      user: udUser,
    };
  }

  async delete(id: string) {
    const user = await this.userModel.findById(new Types.ObjectId(id));

    if (!user) {
      throw new HttpException(
        {
          message: 'User Id Is Not Found!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userModel.findByIdAndUpdate(
      user?._id,
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    return {
      statusCode: 200,
      message: 'Delete User Success',
    };
  }

  async updatePassword(
    body: UpdatePasswordDto,
    user: UserDocument,
    request: Request,
  ) {
    const { password, newPw } = body;

    const isCorrectPassword = await this.checkPassword(
      password,
      user?.password,
    );

    if (!isCorrectPassword) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng!!');
    }

    const passwordHash = await bcrypt.hash(newPw, 10);

    await this.userModel.findByIdAndUpdate(
      user?._id,
      {
        password: passwordHash,
      },
      {
        new: true,
      },
    );

    const stringLog = `✏️<b>Cập nhật mật khẩu tài khoản</b>✏️\n\n${user?.username} vừa cập nhật lại mật khẩu của họ\n<b>Vào lúc</b>: ${moment(new Date()).format('HH:mm - DD/MM/YYYY')}\n`;
    request['message-log'] = stringLog;

    return {
      success: true,
    };
  }
}
