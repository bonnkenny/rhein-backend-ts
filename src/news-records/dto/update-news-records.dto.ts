// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateNewsRecordsDto } from './create-news-records.dto';

export class UpdateNewsRecordsDto extends PartialType(CreateNewsRecordsDto) {}
