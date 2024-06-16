import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Config, DatabaseConfig } from '../shared/types/config.type';

@Injectable()
export class PrismaService extends PrismaClient {
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

  cleanup() {
    return this.$transaction([this.user.deleteMany()]);
  }
}
