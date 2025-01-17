import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../shared/types/pagination.dto';
import { User } from '@prisma/client';
import { UserSelect } from './dto/user.response.dto';
import { ErrorMessages } from '../shared/error-messages';
import { GoogleProfile } from '../auth/strategy/google.profile.type';
import { ConfigurationService } from '../configuration/configuration.service';
import { UserDataService } from '../user-data/user-data.service';
import { CreateUserDataDto } from '../user-data/dto/create-user-data.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configurationService: ConfigurationService,
    private userDataService: UserDataService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException(ErrorMessages.USER_ALREADY_EXISTS);
    }

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: createUserDto.password,
      },
    });

    await this.configurationService.createDefaultConfigForUser(user.id);
    await this.userDataService.create(new CreateUserDataDto(), user.id);

    return user;
  }

  async findAll(pagination: PaginationDto): Promise<User[]> {
    const { page, limit } = pagination;
    const take = limit;
    const skip = page * limit;
    return this.prisma.user.findMany({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: UserSelect,
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return existingUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: UserSelect,
    });

    return user;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      deleted: true,
    };
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
      select: UserSelect,
    });
  }

  async createUserFromGoogle(user: GoogleProfile): Promise<User> {
    const existingUser = await this.findByEmail(user.emails[0].value);

    const email = user.emails[0].value;
    const verified = user.emails[0].verified;
    const displayName = user.displayName;
    const provider = user.provider;

    if (existingUser) {
      if (!existingUser.googleId) {
        await this.prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            googleId: user.id,
            verified,
            provider,
          },
        });
      }
      return existingUser;
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        googleId: user.id,
        verified,
        provider,
      },
      select: UserSelect,
    });

    const userData = new CreateUserDataDto();

    await this.configurationService.createDefaultConfigForUser(newUser.id);
    await this.userDataService.create({ ...userData, displayName }, newUser.id);
    return newUser;
  }

  async getMe(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...UserSelect,
        Config: true,
        UserData: {
          select: {
            xp: true,
            bio: true,
            timeSpent: true,
            avatar: true,
            displayName: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
