import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { AuthDto, AuthResponseDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { ErrorMessages } from '../shared/error-messages';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from './dto/jwt.token';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, Config } from '../shared/types/config.type';
import { GoogleProfile } from './strategy/google.profile.type';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: AuthDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(signupDto.email);

    if (user) {
      throw new BadRequestException(ErrorMessages.USER_ALREADY_EXISTS);
    }

    const hash = await argon2.hash(signupDto.password);

    const newUser = await this.userService.create({
      email: signupDto.email,
      password: hash,
    });

    return {
      message: 'User created successfully',
      userId: newUser.id,
    };
  }

  async login(loginDto: AuthDto, res: Response): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
    }

    const valid = await argon2.verify(user.passwordHash, loginDto.password);

    if (!valid) {
      throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
    }

    const token = await this.signToken(user.email, user.id);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      message: 'Login successful',
      userId: user.id,
    };
  }

  async signToken(email: string, id: string): Promise<JwtToken> {
    const payload = { email, sub: id };

    return {
      access_token: await this.jwtService.signAsync(
        payload,
        this.configService.get<AuthConfig>(Config.AUTH).jwt,
      ),
      expires_in: this.configService.get<AuthConfig>(Config.AUTH).jwt.expiresIn,
    };
  }

  async googleLogin(@Req() req, res: Response): Promise<AuthResponseDto> {
    const user: GoogleProfile = req.user;

    const newUser = await this.userService.createUserFromGoogle(user);

    const token = await this.signToken(newUser.email, newUser.id);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      message: 'Login successful',
      userId: newUser.id,
    };
  }
}
