import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SecretModule } from './modules/secret/secret.module';
import { AdminModule } from './modules/admin/admin.module';
import { RestrictionModule } from './modules/restrictions/restriction.module';
import { GroupModule } from './modules/group/group.module';
import { RouterModule } from '@nestjs/core';
import { NoteModule } from './modules/notes/note.module';
import { Restriction } from './modules/restrictions/restriction.entity';
import { Group } from './modules/group/group.entity';
import { Note } from './modules/notes/note.entity';


@Module({
  //todo : env variables
  imports: [
    TypeOrmModule.forRoot({

    }), UserModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {
}
