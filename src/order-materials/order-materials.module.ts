import { Module } from '@nestjs/common';
import { OrderMaterialsService } from './order-materials.service';
import { OrderMaterialsController } from './order-materials.controller';
import { DocumentOrderMaterialPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentOrderMaterialPersistenceModule],
  controllers: [OrderMaterialsController],
  providers: [OrderMaterialsService],
  exports: [OrderMaterialsService, DocumentOrderMaterialPersistenceModule],
})
export class OrderMaterialsModule {}
