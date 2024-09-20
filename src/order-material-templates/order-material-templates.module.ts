import { Module } from '@nestjs/common';
import { OrderMaterialTemplatesService } from './order-material-templates.service';
import { OrderMaterialTemplatesController } from './order-material-templates.controller';
import { DocumentOrderMaterialTemplatePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentOrderMaterialTemplatePersistenceModule],
  controllers: [OrderMaterialTemplatesController],
  providers: [OrderMaterialTemplatesService],
  exports: [
    OrderMaterialTemplatesService,
    DocumentOrderMaterialTemplatePersistenceModule,
  ],
})
export class OrderMaterialTemplatesModule {}
