import { Injectable } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Badge } from '@prisma/client';
import { PaginationDto } from '../shared/types/pagination.dto';

@Injectable()
export class BadgeService {
  constructor(private prisma: PrismaService) {}

  async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const badge = await this.prisma.badge.create({
      data: createBadgeDto,
    });

    return badge;
  }

  async findAll(paginationDto: PaginationDto): Promise<Badge[]> {
    const { page, limit } = paginationDto;
    const badges = await this.prisma.badge.findMany({
      skip: page * limit,
      take: limit,
    });

    return badges;
  }

  async findOne(id: string): Promise<Badge> {
    const badge = await this.prisma.badge.findUnique({
      where: {
        id,
      },
    });

    return badge;
  }

  async update(id: string, updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    await this.findOne(id);

    const badge = await this.prisma.badge.update({
      where: {
        id,
      },
      data: updateBadgeDto,
    });

    return badge;
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);

    await this.prisma.badge.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
