import { Module } from '@nestjs/common';
import { DashboardService } from '@src/dashboard/dashboard.service';
import { DashboardController } from '@src/dashboard/dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';

import {
  OrderSchema,
  OrderSchemaClass,
} from '@src/orders/infrastructure/persistence/document/entities/order.schema';
import {
  OrderMaterialSchema,
  OrderMaterialSchemaClass,
} from '@src/order-materials/infrastructure/persistence/document/entities/order-material.schema';
import { DashboardRepository } from '@src/dashboard/infrastructure/dashboard.repository';
import { OrdersModule } from '@src/orders/orders.module';
import {
  UserSchema,
  UserSchemaClass,
} from '@src/users/infrastructure/persistence/document/entities/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
      { name: OrderSchemaClass.name, schema: OrderSchema },
      { name: OrderMaterialSchemaClass.name, schema: OrderMaterialSchema },
    ]),
    OrdersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
  exports: [DashboardService],
})
export class DashboardModule {}
