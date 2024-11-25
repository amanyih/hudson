import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { Race, RaceResult } from '@prisma/client';
import { PaginationDto } from '../shared/types/pagination.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { RaceResultService } from '../race-result/race-result.service';
import { EndRaceDto, ParticipantResultDto } from './dto/end-race.dto';
import { CreateRaceResultDto } from '../race-result/dto/create-race-result.dto';

@Injectable()
export class RaceService {
  constructor(
    private prisma: PrismaService,
    private raceResultService: RaceResultService,
  ) {}

  async create(data: CreateRaceDto): Promise<Race> {
    const race = await this.prisma.race.create({ data });
    return race;
  }

  async findAll(pagination: PaginationDto): Promise<Race[]> {
    const { page, limit } = pagination;

    const races = await this.prisma.race.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return races;
  }

  async findOne(id: string): Promise<Race> {
    const race = await this.prisma.race.findUnique({
      where: {
        id,
      },
    });

    if (!race) {
      throw new NotFoundException(`Race with id ${id} not found`);
    }
    return race;
  }

  async update(id: string, data: UpdateRaceDto): Promise<Race> {
    await this.findOne(id);
    const race = await this.prisma.race.update({
      where: {
        id,
      },
      data,
    });
    return race;
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);

    await this.prisma.race.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async joinRace(userId: string, raceId: string): Promise<Race> {
    const race = await this.findOne(raceId);

    const participants = race.participants || [];

    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    const updated_participants = await this.prisma.race.update({
      where: {
        id: raceId,
      },
      data: {
        participants,
      },
    });

    return updated_participants;
  }

  async startRace(id: string): Promise<Race> {
    await this.findOne(id);

    const startedAt = new Date();

    const updatedRace = await this.prisma.race.update({
      where: { id },
      data: { startedAt },
    });

    return updatedRace;
  }

  async extendStartTime(id: string, duration: number): Promise<Race> {
    const race = await this.findOne(id);

    const startTime = new Date(race.startTime.getTime() + duration);

    const updatedRace = this.prisma.race.update({
      where: { id },
      data: { startTime },
    });

    return updatedRace;
  }

  async endRace(payload: EndRaceDto): Promise<RaceResult[]> {
    const race = await this.findOne(payload.raceId);

    if (new Date() < race.startTime) {
      throw new Error("Race hasn't started yet");
    }

    const participants = this.sortByCompletionTime(payload.participants);

    const raceResults: CreateRaceResultDto[] = participants.map(
      (participant, index) => {
        const accuracy = participant.accuracy || 0;
        const completionTime = participant.completionTime || 0;

        return {
          userId: participant.userId,
          raceId: participant.raceId,
          accuracy,
          completionTime,
          wordsTyped: participant.wordsTyped,
          rank: index + 1,
          isWinner: index === 0,
        };
      },
    );

    await this.prisma.race.update({
      where: { id: payload.raceId },
      data: { isFinished: true },
    });

    const results = await this.raceResultService.createBulk(raceResults);
    return results;
  }

  sortByCompletionTime(
    participants: ParticipantResultDto[],
  ): ParticipantResultDto[] {
    return participants.sort((a, b) => a.completionTime - b.completionTime);
  }
}
