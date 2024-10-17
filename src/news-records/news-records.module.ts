import { Module } from '@nestjs/common';
import { NewsRecordsService } from './news-records.service';
import { NewsRecordsController } from './news-records.controller';
import { DocumentNewsRecordsPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentNewsRecordsPersistenceModule],
  controllers: [NewsRecordsController],
  providers: [NewsRecordsService],
  exports: [NewsRecordsService, DocumentNewsRecordsPersistenceModule],
})
export class NewsRecordsModule {}
