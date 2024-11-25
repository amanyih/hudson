import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RaceService } from './race.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { PaginationDto } from '../shared/types/pagination.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { RaceResultService } from '../race-result/race-result.service';

@Controller('race')
export class RaceController {
  constructor(
    private readonly raceService: RaceService,
    private readonly raceResultService: RaceResultService,
  ) {}

  @Post()
  create(@Body() payload: CreateRaceDto) {
    return this.raceService.create(payload);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.raceService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id', id);
    return this.raceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateRaceDto) {
    return this.raceService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.raceService.remove(id);
  }

  @Delete('race-result/:id')
  removeRaceResult(@Param('id') id: string) {
    return this.raceResultService.deleteById(id);
  }

  @Get(':id/results')
  getResults(@Param('id') id: string) {
    return this.raceResultService.getResultsForRace(id);
  }

  @Get('results/:userId')
  getResultForUser(@Param('userId') userId: string) {
    return this.raceResultService.getResultsForUser(userId);
  }

  @Get('wins/:userId')
  getWins(@Param('userId') userId: string) {
    return this.raceResultService.getWinsForUser(userId);
  }
}
