import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderMaterialSchema,
  OrderMaterialSchemaClass,
} from './entities/order-material.schema';
import { OrderMaterialRepository } from '../order-material.repository';
import { OrderMaterialDocumentRepository } from './repositories/order-material.repository';
import {
  OrderSchema,
  OrderSchemaClass,
} from '@src/orders/infrastructure/persistence/document/entities/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderMaterialSchemaClass.name, schema: OrderMaterialSchema },
      { name: OrderSchemaClass.name, schema: OrderSchema },
    ]),
  ],
  providers: [
    {
      provide: OrderMaterialRepository,
      useClass: OrderMaterialDocumentRepository,
    },
  ],
  exports: [OrderMaterialRepository],
})
export class DocumentOrderMaterialPersistenceModule {}
