import { forwardRef, Module } from '@nestjs/common';
import { OrderMaterialsService } from './order-materials.service';
import { OrderMaterialsController } from './order-materials.controller';
import { DocumentOrderMaterialPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { OrdersModule } from '@src/orders/orders.module';
import { NewsRecordsModule } from '@src/news-records/news-records.module';

@Module({
  imports: [
    DocumentOrderMaterialPersistenceModule,
    forwardRef(() => OrdersModule),
    NewsRecordsModule,
  ],
  controllers: [OrderMaterialsController],
  providers: [OrderMaterialsService],
  exports: [OrderMaterialsService, DocumentOrderMaterialPersistenceModule],
})
export class OrderMaterialsModule {}
