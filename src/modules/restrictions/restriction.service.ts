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

    async declare(id: string, restriction) {
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
        if (user.restriction) {
            await this.restrictionsRepository.delete(user.restriction)
        }
        if (restriction && restriction?.type) {
            user.restriction = restriction
            await this.usersRepository.save(user);
        }
        return 1;
    }

    async check(id: string) {
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
        return user.restriction ?? {type: null, timeout: null, setAt: null};
    }

}