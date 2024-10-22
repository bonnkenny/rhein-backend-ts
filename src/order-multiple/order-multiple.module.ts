import { Module } from '@nestjs/common';
import { OrdersModule } from '@src/orders/orders.module';
import { OrderMaterialsModule } from '@src/order-materials/order-materials.module';
import { OrderController } from '@src/order-multiple/order.controller';
import { OrdersService } from '@src/orders/orders.service';
import { OrderMaterialsService } from '@src/order-materials/order-materials.service';

@Module({
  imports: [OrdersModule, OrderMaterialsModule],
  controllers: [OrderController],
  providers: [OrdersService, OrderMaterialsService],
  exports: [],
})
export class OrderMultipleModule {}
