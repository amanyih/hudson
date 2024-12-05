import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { PaginationDto } from '../shared/types/pagination.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '@prisma/client';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto, @GetUser() user: User) {
    return this.resultService.create(createResultDto, user.id);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.resultService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultService.remove(id);
  }
}
