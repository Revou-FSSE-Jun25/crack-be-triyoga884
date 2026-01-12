import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { AuthService } from './auth.service.js';
import type { reqProp } from '../common/types/types.js';
import { JwtAuthGuard } from './jwt.auth-guard.js';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(
    @Body() data: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.userLogin(
      data.email,
      data.password,
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Req() req: { user: reqProp },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return this.authService.userLogout(req.user.userId);
  }

  @Post('refresh')
  async refresh(
    @Req()
    req: Request & { cookies?: { refresh_token?: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    const { access_token, refresh_token: newRefreshToken } =
      await this.authService.refreshToken(refreshToken!);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      accessToken: access_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: reqProp }) {
    return req.user;
  }
}
