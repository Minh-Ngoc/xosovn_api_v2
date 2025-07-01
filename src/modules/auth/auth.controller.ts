import { Controller, Post, Body, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { GetClientIP } from 'src/decorators/userIp.decorator';
import { Response } from 'express';
import { Authentication } from 'src/decorators/authentication.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ResponseMessage } from '@/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage('Login Success', 200)
  @Post('/sign-in')
  signIn(
    @Body() user: LoginUserDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(user, request, userIp, response);
  }

  @Authentication()
  @Post('logout')
  async handleLogout(
    @AuthUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }

  @Get('refresh-token')
  async handleRefreshToken(
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies['refresh_token'];

    return await this.authService.processNewToken(refresh_token, response);
  }
}
