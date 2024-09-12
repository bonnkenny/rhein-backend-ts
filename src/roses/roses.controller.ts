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
import { RosesService } from './roses.service';
import { CreateRoseDto } from './dto/create-rose.dto';
import { UpdateRoseDto } from './dto/update-rose.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Rose } from './domain/rose';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllRosesDto } from './dto/find-all-roses.dto';

@ApiTags('Roses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'roses',
  version: '1',
})
export class RosesController {
  constructor(private readonly rosesService: RosesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Rose,
  })
  create(@Body() createRoseDto: CreateRoseDto) {
    return this.rosesService.create(createRoseDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Rose),
  })
  async findAll(
    @Query() query: FindAllRosesDto,
  ): Promise<InfinityPaginationResponseDto<Rose>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.rosesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Rose,
  })
  findOne(@Param('id') id: string) {
    return this.rosesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Rose,
  })
  update(@Param('id') id: string, @Body() updateRoseDto: UpdateRoseDto) {
    return this.rosesService.update(id, updateRoseDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.rosesService.remove(id);
  }
}
