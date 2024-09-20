import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DocumentOrderPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentOrderPersistenceModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, DocumentOrderPersistenceModule],
})
export class OrdersModule {}
