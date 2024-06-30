import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { UpdateUserDataDto } from './dto/update-user-data.dto';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get()
  findAll() {
    return this.userDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDataService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDatumDto: UpdateUserDataDto,
  ) {
    return this.userDataService.update(id, updateUserDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDataService.remove(id);
  }
}
