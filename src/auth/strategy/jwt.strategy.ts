import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthConfig, Config } from '../../shared/types/config.type';
import { JwtPayload } from './jwt.payload';
import { UserSelect } from '../../user/dto/user.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<AuthConfig>(Config.AUTH).jwt.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: UserSelect,
    });
  }
}
