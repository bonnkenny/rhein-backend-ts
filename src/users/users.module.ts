import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { FilesModule } from '../files/files.module';
import { SessionModule } from '@src/session/session.module';
import { OrderUsersModule } from '@src/order-users/order-users.module';
import { MailModule } from '@src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

const infrastructurePersistenceModule = DocumentUserPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    FilesModule,
    SessionModule,
    OrderUsersModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
