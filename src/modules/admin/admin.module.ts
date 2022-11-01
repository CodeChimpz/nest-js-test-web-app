import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RouterModule } from '@nestjs/core';
import { GroupModule } from '../group/group.module';
import { RestrictionModule } from '../restrictions/restriction.module';
import { NoteModule } from '../notes/note.module';
import { AdminController } from './admin.controller';
import { NoteController } from '../notes/note.controller';
import { RestrictionController } from '../restrictions/restriction.controller';
import { GroupController } from '../group/group.controller';

@Module({
  imports: [
    GroupModule,
    RestrictionModule,
    NoteModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'notes',
            module: NoteModule,
          },
          {
            path: 'restrictions',
            module: RestrictionModule,
          },
          {
            path: 'groups',
            module: GroupModule,
          },
        ],
      },
    ]),
  ],
  providers: [
    AdminService,
  ],
  controllers: [
    AdminController,NoteController,RestrictionController,GroupController
  ],
  exports: [
    GroupModule,
    RestrictionModule,
    NoteModule,
  ],
})
export class AdminModule {
}
