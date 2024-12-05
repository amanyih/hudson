import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../shared/types/pagination.dto';
import { Result } from '@prisma/client';

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  async create(
    createResultDto: CreateResultDto,
    userId: string,
  ): Promise<Result> {
    const result = await this.prisma.result.create({
      data: {
        ...createResultDto,
        userId,
      },
    });
    return result;
  }

  async findAll(paginationDto: PaginationDto): Promise<Result[]> {
    const { page, limit } = paginationDto;
    const results = await this.prisma.result.findMany({
      skip: page * limit,
      take: limit,
    });

    return results;
  }

  async findOne(id: string): Promise<Result> {
    const result = await this.prisma.result.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException(`Result with id ${id} not found`);
    }

    return result;
  }

  async update(id: string, updateResultDto: UpdateResultDto): Promise<Result> {
    await this.findOne(id);

    const result = await this.prisma.result.update({
      where: {
        id,
      },
      data: updateResultDto,
    });

    return result;
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);

    await this.prisma.result.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
