import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, OrderSchemaClass } from './entities/order.schema';
import { OrderRepository } from '../order.repository';
import { OrderDocumentRepository } from './repositories/order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderSchemaClass.name, schema: OrderSchema },
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
