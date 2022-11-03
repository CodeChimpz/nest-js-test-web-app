import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Restriction} from './restriction.entity';
import {User} from '../user/user.entity';
import {Repository} from 'typeorm';

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
        const user = await this.usersRepository.findOne({
            where: {
                id: id
            },
            relations: {
                restriction: true
            }
        });
        if (!user) {
            return;
        }
        if (!restriction) {
            user.restriction = null
            return 1;
        }
        Object.assign(user.restriction, restriction)
        await this.usersRepository.save(user);
        return 1;
    }

    async check(id: number) {
        const user = await this.usersRepository.findOne(
            {
                where:
                    {
                        id: id
                    },
                relations: {
                    restriction: true
                }
            });
        return user.restriction || {type: null, timeout: null, setAt: null};
    }

    async convertTime() {

    }
}