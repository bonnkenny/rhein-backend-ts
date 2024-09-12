import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { DocumentMenuPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentMenuPersistenceModule],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService, DocumentMenuPersistenceModule],
})
export class MenusModule {}
