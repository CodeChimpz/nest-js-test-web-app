import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RestrictionService } from './restriction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Restriction } from './restriction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Restriction]),
  ],
  providers: [RestrictionService],
  exports: [RestrictionService],
})
export class RestrictionModule {
}