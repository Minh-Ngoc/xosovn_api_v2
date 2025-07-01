import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RoleService } from '../role/role.service';
import { Request } from 'express';
import { Response } from 'express';
import ms from 'ms';
import moment from 'moment';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserDocument } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}
  /**
   * Sign In
   */
  async signIn(
    _user: LoginUserDto,
    request: Request,
    userIp: string,
    response: Response,
  ) {
    try {
      const { username, password } = _user;
      const user = await this.userService.checkUsername(username);

      if (!user)
        throw new HttpException(
          {
            message: 'User Name Or Password Is Not Correct',
          },
          HttpStatus.BAD_REQUEST,
        );

      const checkPassword = await this.userService.checkPassword(
        password,
        user.password,
      );

      if (!checkPassword)
        throw new HttpException(
          {
            message: 'User Name Or Password Is Not Correct',
          },
          HttpStatus.BAD_REQUEST,
        );

      const permission = await this.userService.getUserById(user.id);
      const payload = {
        username,
        email: user.email,
        user_id: user._id,
      };

      const accessToken = await this.jwtService.signAsync(payload);
      await this.handleRefreshToken(payload, user._id, response);

      const userData = {
        username: user.username,
        name: user.name,
      };
      const stringLog = `Người dùng <b>${user?.username}</b> vừa đăng nhập\n<b>Vào lúc</b>: ${moment(new Date()).format('HH:mm - DD/MM/YYYY')}\n<b>IP người thực hiện</b>: ${userIp}\n`;
      request['message-log'] = stringLog;
      request['user'] = user;

      return {
        accessToken,
        userId: user._id,
        message: 'Login Success',
        role: permission.role,
        permission: permission.permission,
        userData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Logout
   */
  logout = async (user: UserDocument, response: Response) => {
    await this.userService.updateRefreshToken({
      refresh_token: '',
      _id: user?._id,
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/', // Ensure the path is consistent
    });

    return 'ok';
  };

  /**
   * Process New Token
   */
  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      // If no refresh token is provided, throw a BadRequestException
      if (!refresh_token) {
        throw new BadRequestException(`Could not find refresh token`);
      }
      // Verify the provided refresh token using the secret
      const decoded = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      if (!decoded) {
        throw new BadRequestException(`Invalid refresh token`);
      }

      // Find the user associated with the provided refresh token
      const user = await this.userService.findUserByToken(refresh_token);

      // If no user is found, throw a BadRequestException
      if (!user) {
        throw new BadRequestException(`Could not find refresh token`);
      }

      const payload = {
        username: user?.username,
        email: user.email,
        user_id: user._id,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      await this.handleRefreshToken(payload, user._id, response);

      return {
        accessToken,
        status: HttpStatus.OK,
      };
    } catch (error) {
      // If the error is a TokenExpiredError, throw an UnauthorizedException
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('EXPIRED_REFRESH_TOKEN');
      }
      // For all other errors, throw a BadRequestException
      throw error;
    }
  };

  /**
   * Refresh Token
   */
  handleRefreshToken = async (payload, userId, response) => {
    // Create a new refresh token with the payload
    const newRefreshToken = await this.createRefreshToken(payload);

    // Update the user's refresh token in the database
    await this.userService.updateRefreshToken({
      refresh_token: newRefreshToken,
      _id: userId,
    });

    // Clear the old refresh token cookie with consistent options
    response.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/', // Ensure the path is consistent
    });

    const refreshTokenOptions = {
      expires: new Date(Date.now() + ms(process.env.EXPIRES_REFRESH_TOKEN_JWT)),
      maxAge: ms(process.env.EXPIRES_REFRESH_TOKEN_JWT),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/', // Ensure the path is consistent
    };

    response.cookie('refresh_token', newRefreshToken, refreshTokenOptions);
  };

  /**
   * Create Refresh Token
   */
  createRefreshToken = async (payload: any) => {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRES_REFRESH_TOKEN_JWT,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    return refreshToken;
  };
}
