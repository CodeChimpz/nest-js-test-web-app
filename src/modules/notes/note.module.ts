import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Note } from './note.entity';
import {WinstonModule} from "../logger/winston.module";

@Module({
  imports: [
    WinstonModule,
    TypeOrmModule.forFeature([User,Note]),
  ],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {
}
