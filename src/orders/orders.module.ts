import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DocumentOrderPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from '@src/users/users.module';
import { OrderMaterialsModule } from '@src/order-materials/order-materials.module';
import { OrderMaterialTemplatesModule } from '@src/order-material-templates/order-material-templates.module';
import { OrderUsersModule } from '@src/order-users/order-users.module';
import { MailModule } from '@src/mail/mail.module';
import { PdfModule } from '@src/pdf-lib/pdf.module';

@Module({
  imports: [
    DocumentOrderPersistenceModule,
    UsersModule,
    forwardRef(() => OrderMaterialsModule),
    OrderMaterialTemplatesModule,
    OrderUsersModule,
    MailModule,
    PdfModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, DocumentOrderPersistenceModule],
})
export class OrdersModule {}
