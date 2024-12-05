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
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { PaginationDto } from '../shared/types/pagination.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '@prisma/client';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  create(
    @Body() createConfigurationDto: CreateConfigurationDto,
    @GetUser() user: User,
  ) {
    return this.configurationService.create(createConfigurationDto, user.id);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.configurationService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configurationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    return this.configurationService.update(id, updateConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configurationService.remove(id);
  }
}
