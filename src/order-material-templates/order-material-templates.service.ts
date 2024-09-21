import { Injectable } from '@nestjs/common';
import { CreateOrderMaterialTemplateDto } from './dto/create-order-material-template.dto';
import { UpdateOrderMaterialTemplateDto } from './dto/update-order-material-template.dto';
import { OrderMaterialTemplateRepository } from './infrastructure/persistence/order-material-template.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { OrderMaterialTemplate } from './domain/order-material-template';

@Injectable()
export class OrderMaterialTemplatesService {
  constructor(
    private readonly orderMaterialTemplateRepository: OrderMaterialTemplateRepository,
  ) {}

  create(createOrderMaterialTemplateDto: CreateOrderMaterialTemplateDto) {
    // console.log('a>>', 'aaaa');
    return this.orderMaterialTemplateRepository.create(
      createOrderMaterialTemplateDto,
    );
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.orderMaterialTemplateRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: OrderMaterialTemplate['id']) {
    return this.orderMaterialTemplateRepository.findById(id);
  }

  update(
    id: OrderMaterialTemplate['id'],
    updateOrderMaterialTemplateDto: UpdateOrderMaterialTemplateDto,
  ) {
    return this.orderMaterialTemplateRepository.update(
      id,
      updateOrderMaterialTemplateDto,
    );
  }

  remove(id: OrderMaterialTemplate['id']) {
    return this.orderMaterialTemplateRepository.remove(id);
  }
}
