import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, OrderSchemaClass } from './entities/order.schema';
import { OrderRepository } from '../order.repository';
import { OrderDocumentRepository } from './repositories/order.repository';
import {
  OrderMaterialSchema,
  OrderMaterialSchemaClass,
} from '@src/order-materials/infrastructure/persistence/document/entities/order-material.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderSchemaClass.name, schema: OrderSchema },
      { name: OrderMaterialSchemaClass.name, schema: OrderMaterialSchema },
    ]),
  ],
  providers: [
    {
      provide: OrderRepository,
      useClass: OrderDocumentRepository,
    },
  ],
  exports: [OrderRepository],
})
export class DocumentOrderPersistenceModule {}
