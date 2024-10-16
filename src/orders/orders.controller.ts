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
  Request,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from './domain/order';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityApiResponse,
  InfinityApiResponseDto,
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';
import {
  infinityPagination,
  infinityResponse,
} from '../utils/infinity-response';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { NullableType } from '@src/utils/types/nullable.type';
import { PdfService } from '@src/pdf-lib/pdf.service';
import { Response } from 'express';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: InfinityApiResponse(Order),
  })
  async create(
    @Request() request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<InfinityApiResponseDto<Order>> {
    // console.log('createOrderDto', createOrderDto);
    const order = await this.ordersService.createWithMaterial(
      request.user,
      createOrderDto,
    );
    // console.log('order', order);
    return infinityResponse(order);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Order),
  })
  async findAll(
    @Request() request,
    @Query() query: FilterOrdersDto,
  ): Promise<InfinityPaginationResponseDto<Order>> {
    const { page, limit } = query;
    const [items, total] = await this.ordersService.findAllWithPagination(
      request.user,
      query,
    );
    return infinityPagination(items, total, { page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(Order),
  })
  findOne(
    @Param('id') id: string,
  ): InfinityApiResponseDto<Promise<NullableType<Order>>> {
    return infinityResponse(this.ordersService.findOne(id));
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(Order),
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: Pick<UpdateOrderDto, 'orderName' | 'orderNo'>,
  ): InfinityApiResponseDto<Promise<Order | null>> {
    return infinityResponse(this.ordersService.update(id, updateOrderDto));
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Patch(':id/proxy-set')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        proxySet: { type: 'boolean', example: true },
      },
      required: ['proxySet'],
    },
  })
  @ApiOkResponse({
    type: InfinityApiResponse(Order),
  })
  updateProxySet(
    @Param('id') id: string,
    @Request() request: any,
    @Body() updateOrderDto: Pick<UpdateOrderDto, 'proxySet'>,
  ): InfinityApiResponseDto<Promise<Order | null>> {
    return infinityResponse(
      this.ordersService.updateProxySet(id, request.user, updateOrderDto),
    );
  }

  @Get(':id/chains')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  getChains(@Param('id') id: string): InfinityApiResponseDto<any> {
    return infinityResponse(this.ordersService.getOrderChains(id));
  }

  @Get(':id/chain-export')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  // @ApiOkResponse({ type: () })
  async pdfExport(@Param('id') id: string, @Res() res: Response) {
    const files = await this.ordersService.getChainFiles(id);
    const pdfBuffer = await this.pdfService.mergePdfs(files);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=order.pdf');
    res.send(pdfBuffer);
  }

  @Patch(':id/check-customer-optional')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerOptionalCheck: {
          type: 'string',
          enum: ['APPROVED', 'REJECTED'],
        },
      },
      required: ['customerOptionalCheck'],
    },
  })
  @ApiOkResponse({ type: InfinityApiResponse() })
  async checkCustomerOptional(
    @Param('id') id: string,
    @Body()
    updateOrderDto: Pick<UpdateOrderDto, 'customerOptionalCheck'>,
  ) {
    const ret = await this.ordersService.checkCustomOptional(
      id,
      updateOrderDto,
    );
    return infinityResponse({}, !!ret ? 'Ok' : 'Operation failed!', !!ret);
  }
}
