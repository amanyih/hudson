import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRaceResultDto } from './dto/create-race-result.dto';
import { RaceResult } from '@prisma/client';

@Injectable()
export class RaceResultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRaceResultDto): Promise<RaceResult> {
    const { userId, raceId } = data;
    const existingResult = await this.prisma.raceResult.findFirst({
      where: {
        userId,
        raceId,
      },
    });

    if (existingResult) {
      return existingResult;
    }

    const raceResult = await this.prisma.raceResult.create({
      data,
    });

    return raceResult;
  }

  async createBulk(data: CreateRaceResultDto[]): Promise<RaceResult[]> {
    const results = await Promise.all(
      data.map(async result => {
        const { userId, raceId } = result;
        const existingResult = await this.prisma.raceResult.findFirst({
          where: {
            userId,
            raceId,
          },
        });

        if (existingResult) {
          return existingResult;
        }

        const raceResult = await this.prisma.raceResult.create({
          data: result,
        });
        return raceResult;
      }),
    );

    return results;
  }

  async getById(id: string): Promise<RaceResult> {
    const result = await this.prisma.raceResult.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException(`Race result with id ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.raceResult.delete({
      where: {
        id,
      },
    });

    return !!result;
  }

  async getResultsForRace(raceId: string): Promise<RaceResult[]> {
    if (!(await this.raceExists(raceId))) {
      throw new NotFoundException(`Race with id ${raceId} not found`);
    }

    const results = await this.prisma.raceResult.findMany({
      where: {
        raceId,
      },

      orderBy: {
        rank: 'asc',
      },
    });

    return results;
  }

  async getResultsForUser(userId: string): Promise<RaceResult[]> {
    const results = await this.prisma.raceResult.findMany({
      where: {
        userId,
      },
    });
    return results;
  }

  async getWinsForUser(userId: string): Promise<number> {
    const wins = await this.prisma.raceResult.count({
      where: {
        userId,
        isWinner: true,
      },
    });

    return wins;
  }

  async getAverageAccuracyForUser(userId: string): Promise<number> {
    const results = await this.prisma.raceResult.findMany({
      where: {
        userId,
      },
    });

    const totalAccuracy = results.reduce(
      (acc, result) => acc + result.accuracy,
      0,
    );

    return totalAccuracy / results.length;
  }

  async getAverageSpeedForUser(userId: string): Promise<number> {
    const results = await this.prisma.raceResult.findMany({
      where: {
        userId,
      },
    });

    const totalSpeed = results.reduce(
      (acc, result) => acc + result.wordsTyped / result.completionTime,
      0,
    );

    return totalSpeed / results.length;
  }

  async getTopResultsForUser(userId: string, limit = 5): Promise<RaceResult[]> {
    const results = await this.prisma.raceResult.findMany({
      where: {
        userId,
      },
      orderBy: {
        rank: 'asc',
      },
      take: limit,
    });

    return results;
  }

  async getTopResultsForRace(raceId: string, limit = 5): Promise<RaceResult[]> {
    if (!this.raceExists(raceId)) {
      throw new NotFoundException(`Race with id ${raceId} not found`);
    }

    const results = await this.prisma.raceResult.findMany({
      where: {
        raceId,
      },
      orderBy: {
        rank: 'asc',
      },
      take: limit,
    });

    return results;
  }

  async raceExists(id: string): Promise<boolean> {
    const race = await this.prisma.race.findUnique({
      where: { id },
    });
    return !!race;
  }
}
