import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NewsRecordsService } from './news-records.service';
import { CreateNewsRecordsDto } from './dto/create-news-records.dto';
import { UpdateNewsRecordsDto } from './dto/update-news-records.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NewsRecords } from './domain/news-records';
import { AuthGuard } from '@nestjs/passport';

import {
  InfinityApiResponse,
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';

import {
  infinityPagination,
  infinityResponse,
} from '../utils/infinity-response';

import { FindAllNewsRecordsDto } from './dto/find-all-news-records.dto';

@ApiTags('NewsRecords')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'news-records',
  version: '1',
})
export class NewsRecordsController {
  constructor(private readonly newsRecordsService: NewsRecordsService) {}

  @Post()
  @ApiCreatedResponse({
    type: InfinityApiResponse(NewsRecords),
  })
  create(@Body() createNewsRecordsDto: CreateNewsRecordsDto) {
    const entity = this.newsRecordsService.create(createNewsRecordsDto);
    return infinityResponse(entity);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(NewsRecords),
  })
  async findAll(
    @Query() query: FindAllNewsRecordsDto,
  ): Promise<InfinityPaginationResponseDto<NewsRecords>> {
    const [items, total] =
      await this.newsRecordsService.findAllWithPagination(query);
    return infinityPagination(items, total, query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: NewsRecords,
  })
  findOne(@Param('id') id: string) {
    return this.newsRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(NewsRecords),
  })
  update(
    @Param('id') id: string,
    @Body() updateNewsRecordsDto: UpdateNewsRecordsDto,
  ) {
    const entity = this.newsRecordsService.update(id, updateNewsRecordsDto);
    return infinityResponse(entity);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.newsRecordsService.remove(id);
  }
}
