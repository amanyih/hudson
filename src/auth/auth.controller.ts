import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GoogleOAuthGuard } from './guard/google.auth.guard';
import { Response } from 'express';
import { Public } from './decorator/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async register(@Body() signupDto: AuthDto) {
    return this.authService.signup(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(loginDto, response);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.googleLogin(req, res);
  }
}
