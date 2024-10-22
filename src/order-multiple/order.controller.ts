import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityApiResponse,
  InfinityApiResponseDto,
} from '@src/utils/dto/infinity-base-response.dto';
import { infinityResponse } from '@src/utils/infinity-response';
import { Response } from 'express';
import {
  SetOrderStatusDto,
  UpdateCustomOptionalOrderDto,
} from '@src/orders/dto/update-order.dto';
import { Order } from '@src/orders/domain/order';
import { OrdersService } from '@src/orders/orders.service';
import { PdfService } from '@src/pdf-lib/pdf.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'orders',
  version: '1',
})
export class OrderController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService,
  ) {}
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
        customerOptionalReason: { type: 'string' },
      },
      required: ['customerOptionalCheck'],
    },
  })
  @ApiOkResponse({ type: InfinityApiResponse() })
  async checkCustomerOptional(
    @Param('id') id: string,
    @Body()
    updateOrderDto: UpdateCustomOptionalOrderDto,
  ) {
    const ret = await this.ordersService.checkCustomOptional(
      id,
      updateOrderDto,
    );
    return infinityResponse({}, !!ret ? 'Ok' : 'Operation failed!', !!ret);
  }

  @Patch(':id/set-completed')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({ type: InfinityApiResponse(Order) })
  async setCompleted(@Param('id') id: string, @Body() body: SetOrderStatusDto) {
    return infinityResponse(await this.ordersService.setCompleted(id, body));
  }
}
