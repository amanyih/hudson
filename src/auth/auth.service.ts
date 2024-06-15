import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { ErrorMessages } from '../shared/error-messages';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
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

  async login(loginDto: LoginDto): Promise<User> {
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

    return user;
  }
}
