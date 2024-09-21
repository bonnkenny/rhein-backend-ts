import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DocumentOrderPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [DocumentOrderPersistenceModule, UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, DocumentOrderPersistenceModule],
})
export class OrdersModule {}
