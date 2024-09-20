import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderMaterialTemplateSchema,
  OrderMaterialTemplateSchemaClass,
} from './entities/order-material-template.schema';
import { OrderMaterialTemplateRepository } from '../order-material-template.repository';
import { OrderMaterialTemplateDocumentRepository } from './repositories/order-material-template.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderMaterialTemplateSchemaClass.name,
        schema: OrderMaterialTemplateSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: OrderMaterialTemplateRepository,
      useClass: OrderMaterialTemplateDocumentRepository,
    },
  ],
  exports: [OrderMaterialTemplateRepository],
})
export class DocumentOrderMaterialTemplatePersistenceModule {}
