import { Module } from '@nestjs/common';
import { RosesService } from './roses.service';
import { RosesController } from './roses.controller';
import { DocumentRosePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentRosePersistenceModule],
  controllers: [RosesController],
  providers: [RosesService],
  exports: [RosesService, DocumentRosePersistenceModule],
})
export class RosesModule {}
