import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderMaterialSchema,
  OrderMaterialSchemaClass,
} from './entities/order-material.schema';
import { OrderMaterialRepository } from '../order-material.repository';
import { OrderMaterialDocumentRepository } from './repositories/order-material.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderMaterialSchemaClass.name, schema: OrderMaterialSchema },
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
