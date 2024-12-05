import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserData } from '@prisma/client';

@Injectable()
export class UserDataService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDataDto: CreateUserDataDto,
    userId: string,
  ): Promise<UserData> {
    const userData = await this.prisma.userData.create({
      data: {
        ...createUserDataDto,
        userId,
      },
    });
    return userData;
  }

  async findAll(): Promise<UserData[]> {
    const userData = await this.prisma.userData.findMany();
    return userData;
  }

  async findOne(id: string): Promise<UserData> {
    const userData = await this.prisma.userData.findUnique({
      where: {
        id,
      },
    });

    if (!userData) {
      throw new NotFoundException(`UserData with id ${id} not found`);
    }

    return userData;
  }

  async update(
    id: string,
    updateUserDataDto: UpdateUserDataDto,
  ): Promise<UserData> {
    await this.findOne(id);

    const userData = await this.prisma.userData.update({
      where: {
        id,
      },
      data: updateUserDataDto,
    });

    return userData;
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);

    await this.prisma.userData.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
