import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  orderUserSchema,
  OrderUserSchemaClass,
} from './entities/order-user.schema';
import { orderUserRepository } from '../order-user.repository';
import { OrderUserDocumentRepository } from './repositories/order-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderUserSchemaClass.name, schema: orderUserSchema },
    ]),
  ],
  providers: [
    {
      provide: orderUserRepository,
      useClass: OrderUserDocumentRepository,
    },
  ],
  exports: [orderUserRepository],
})
export class DocumentOrderUserPersistenceModule {}
