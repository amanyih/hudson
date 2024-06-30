import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDataDto } from './create-user-data.dto';

export class UpdateUserDataDto extends PartialType(CreateUserDataDto) {}
