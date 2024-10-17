import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NewsRecordsSchema,
  NewsRecordsSchemaClass,
} from './entities/news-records.schema';
import { NewsRecordsRepository } from '../news-records.repository';
import { NewsRecordsDocumentRepository } from './repositories/news-records.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsRecordsSchemaClass.name, schema: NewsRecordsSchema },
    ]),
  ],
  providers: [
    {
      provide: NewsRecordsRepository,
      useClass: NewsRecordsDocumentRepository,
    },
  ],
  exports: [NewsRecordsRepository],
})
export class DocumentNewsRecordsPersistenceModule {}
