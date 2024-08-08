import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { PaginationDto } from '../shared/types/pagination.dto';

@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgeService.create(createBadgeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.badgeService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badgeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgeService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.badgeService.remove(id);
  }
}
