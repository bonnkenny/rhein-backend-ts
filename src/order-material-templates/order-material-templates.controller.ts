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
import { OrderMaterialTemplatesService } from './order-material-templates.service';
import { CreateOrderMaterialTemplateDto } from './dto/create-order-material-template.dto';
import { UpdateOrderMaterialTemplateDto } from './dto/update-order-material-template.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OrderMaterialTemplate } from './domain/order-material-template';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityApiResponseDto,
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';
import {
  infinityPagination,
  infinityResponse,
} from '../utils/infinity-response';
import { FilterOrderMaterialTemplatesDto } from './dto/find-all-order-material-templates.dto';

@ApiTags('OrderMaterialTemplates')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'order-material-templates',
  version: '1',
})
export class OrderMaterialTemplatesController {
  constructor(
    private readonly orderMaterialTemplatesService: OrderMaterialTemplatesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: OrderMaterialTemplate,
  })
  async create(
    @Body() createOrderMaterialTemplateDto: CreateOrderMaterialTemplateDto,
  ): Promise<InfinityApiResponseDto<OrderMaterialTemplate>> {
    const ret = await this.orderMaterialTemplatesService.create(
      createOrderMaterialTemplateDto,
    );
    // console.log('before return >>', ret);
    console.log('before return json >>', JSON.stringify(ret));
    // return errorBody('aa');
    return infinityResponse(ret);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(OrderMaterialTemplate),
  })
  async findAll(
    @Query() query: FilterOrderMaterialTemplatesDto,
  ): Promise<InfinityPaginationResponseDto<OrderMaterialTemplate>> {
    const [items, total] =
      await this.orderMaterialTemplatesService.findAllWithPagination(query);

    return infinityPagination(items, total, query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: OrderMaterialTemplate,
  })
  findOne(@Param('id') id: string) {
    return this.orderMaterialTemplatesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: OrderMaterialTemplate,
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderMaterialTemplateDto: UpdateOrderMaterialTemplateDto,
  ) {
    return this.orderMaterialTemplatesService.update(
      id,
      updateOrderMaterialTemplateDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.orderMaterialTemplatesService.remove(id);
  }
}
