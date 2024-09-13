import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema, RoleSchemaClass } from './entities/role.schema';
import { RoleRepository } from '../role.repository';
import { RoleDocumentRepository } from './repositories/role.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleSchemaClass.name, schema: RoleSchema },
    ]),
  ],
  providers: [
    {
      provide: RoleRepository,
      useClass: RoleDocumentRepository,
    },
  ],
  exports: [RoleRepository],
})
export class DocumentRolePersistenceModule {}
