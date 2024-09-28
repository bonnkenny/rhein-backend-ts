import { Module } from '@nestjs/common';
import { orderUsersService } from './order-users.service';
import { orderUsersController } from './order-users.controller';
import { DocumentorderUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentorderUserPersistenceModule],
  controllers: [orderUsersController],
  providers: [orderUsersService],
  exports: [orderUsersService, DocumentorderUserPersistenceModule],
})
export class orderUsersModule {}
