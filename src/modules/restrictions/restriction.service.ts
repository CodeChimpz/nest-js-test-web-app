import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restriction } from './restriction.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestrictionService {
  constructor(
    @InjectRepository(Restriction)
    private restrictionsRepository: Repository<Restriction>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
  }

  async declare(id: number, restriction) {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      return;
    }
    user.restriction = restriction;
    await this.usersRepository.save(user);
  }

  async check(id: number) {
    const user = await this.usersRepository.findOneBy(
      { id: id });
    return user.restriction;
  }
}