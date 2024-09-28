import { Module } from '@nestjs/common';
import { OrderUsersService } from './order-users.service';
import { OrderUsersController } from './order-users.controller';
import { DocumentOrderUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentOrderUserPersistenceModule],
  controllers: [OrderUsersController],
  providers: [OrderUsersService],
  exports: [OrderUsersService, DocumentOrderUserPersistenceModule],
})
export class OrderUsersModule {}
