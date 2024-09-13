import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DocumentRolePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentRolePersistenceModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService, DocumentRolePersistenceModule],
})
export class RolesModule {}
