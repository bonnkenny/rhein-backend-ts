import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuSchema, MenuSchemaClass } from './entities/menu.schema';
import { MenuRepository } from '../menu.repository';
import { MenuDocumentRepository } from './repositories/menu.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuSchemaClass.name, schema: MenuSchema },
    ]),
  ],
  providers: [
    {
      provide: MenuRepository,
      useClass: MenuDocumentRepository,
    },
  ],
  exports: [MenuRepository],
})
export class DocumentMenuPersistenceModule {}
