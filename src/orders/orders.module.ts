import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DocumentOrderPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from '@src/users/users.module';
import { OrderMaterialsModule } from '@src/order-materials/order-materials.module';
import { OrderMaterialTemplatesModule } from '@src/order-material-templates/order-material-templates.module';

@Module({
  imports: [
    DocumentOrderPersistenceModule,
    UsersModule,
    forwardRef(() => OrderMaterialsModule),
    OrderMaterialTemplatesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, DocumentOrderPersistenceModule],
})
export class OrdersModule {}
