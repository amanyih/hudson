import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { ErrorMessages } from '../shared/error-messages';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from './dto/jwt.token';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, Config } from '../shared/types/config.type';
import { GoogleProfile } from './strategy/google.profile.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const user = await this.userService.findByEmail(signupDto.email);

    if (user) {
      throw new HttpException(
        ErrorMessages.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = await argon2.hash(signupDto.password);

    return await this.userService.create({
      email: signupDto.email,
      password: hash,
    });
  }

  async login(loginDto: LoginDto): Promise<JwtToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        ErrorMessages.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const valid = await argon2.verify(user.passwordHash, loginDto.password);

    if (!valid) {
      throw new HttpException(
        ErrorMessages.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.signToken(user.email, user.id);
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

  async googleLogin(@Req() req): Promise<JwtToken> {
    const user: GoogleProfile = req.user;

    const newUser = await this.userService.createUserFromGoogle(user);

    return this.signToken(newUser.email, newUser.id);
  }
}
