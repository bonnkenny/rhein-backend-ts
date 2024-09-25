import { Injectable } from '@nestjs/common';
import { CreateOrderMaterialTemplateDto } from './dto/create-order-material-template.dto';
import { UpdateOrderMaterialTemplateDto } from './dto/update-order-material-template.dto';
import { OrderMaterialTemplateRepository } from './infrastructure/persistence/order-material-template.repository';
import { OrderMaterialTemplate } from './domain/order-material-template';
import { FilterOrderMaterialTemplatesDto } from '@src/order-material-templates/dto/find-all-order-material-templates.dto';

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

  findAllWithPagination(filterOptions: FilterOrderMaterialTemplatesDto) {
    return this.orderMaterialTemplateRepository.findAllWithPagination(
      filterOptions,
    );
  }

  findAll(filter: Omit<FilterOrderMaterialTemplatesDto, 'page' | 'limit'>) {
    return this.orderMaterialTemplateRepository.findAll(filter);
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
