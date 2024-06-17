import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Config, DatabaseConfig } from '../shared/types/config.type';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<DatabaseConfig>(Config.DATABASE).datasources.db
            .url,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  cleanup() {
    return this.$transaction([this.user.deleteMany()]);
  }
}
