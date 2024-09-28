import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  orderUserSchema,
  orderUserSchemaClass,
} from './entities/order-user.schema';
import { orderUserRepository } from '../order-user.repository';
import { orderUserDocumentRepository } from './repositories/order-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: orderUserSchemaClass.name, schema: orderUserSchema },
    ]),
  ],
  providers: [
    {
      provide: orderUserRepository,
      useClass: orderUserDocumentRepository,
    },
  ],
  exports: [orderUserRepository],
})
export class DocumentorderUserPersistenceModule {}
