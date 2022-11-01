import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Group } from './group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Group])],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {
}
