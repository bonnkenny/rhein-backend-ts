import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoseSchema, RoseSchemaClass } from './entities/rose.schema';
import { RoseRepository } from '../rose.repository';
import { RoseDocumentRepository } from './repositories/rose.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoseSchemaClass.name, schema: RoseSchema },
    ]),
  ],
  providers: [
    {
      provide: RoseRepository,
      useClass: RoseDocumentRepository,
    },
  ],
  exports: [RoseRepository],
})
export class DocumentRosePersistenceModule {}
