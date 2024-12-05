import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Config } from '@prisma/client';
import { PaginationDto } from '../shared/types/pagination.dto';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createConfigurationDto: CreateConfigurationDto,
    userId: string,
  ): Promise<Config> {
    const existingConfiguration = await this.prisma.config.findFirst({
      where: {
        userId,
      },
    });

    let configuration: Config;

    if (existingConfiguration) {
      configuration = await this.prisma.config.update({
        where: {
          id: existingConfiguration.id,
        },
        data: createConfigurationDto,
      });
    } else {
      configuration = await this.prisma.config.create({
        data: {
          ...createConfigurationDto,
          userId,
        },
      });
    }
    return configuration;
  }

  async findAll(paginationDto: PaginationDto): Promise<Config[]> {
    const { page, limit } = paginationDto;
    const configs = await this.prisma.config.findMany({
      skip: page * limit,
      take: limit,
    });

    return configs;
  }

  async findOne(id: string): Promise<Config> {
    const config = await this.prisma.config.findUnique({
      where: {
        id: id,
      },
    });

    if (!config) {
      throw new NotFoundException(`Config with id ${id} not found`);
    }

    return config;
  }

  async update(
    id: string,
    updateConfigurationDto: UpdateConfigurationDto,
  ): Promise<Config> {
    await this.findOne(id);

    const config = await this.prisma.config.update({
      where: {
        id: id,
      },
      data: updateConfigurationDto as unknown as Config,
    });

    return config;
  }

  async remove(id: string): Promise<Config> {
    const existing = await this.findOne(id);

    const newConfig = new CreateConfigurationDto();

    const config = await this.prisma.config.update({
      where: {
        id,
      },
      data: {
        ...newConfig,
        userId: existing.userId,
      },
    });

    return config;
  }

  async createDefaultConfigForUser(userId: string): Promise<Config> {
    const configuration = await this.prisma.config.create({
      data: {
        userId,
      },
    });

    return configuration;
  }
}
