import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User_IF} from '../../interfaces/user.interface';
import {User} from './user.entity';

//CRUD operations on User entity
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    async create(user: User_IF) {
        await this.usersRepository.save(user);
    }

    async delete(id: number) {
        await this.usersRepository.delete(id)
    }

    async update(user: User_IF) {
        const toUpdate = await this.usersRepository.findOneBy({id: user.id})
        await this.usersRepository.update(toUpdate, user)
    }

    async find(id: number): Promise<User_IF> {
        return await this.usersRepository.findOneBy({id: id});
    }

    async checkEmail(email: string): Promise<any> {
        return await this.usersRepository.findOneBy({email: email});
    }

}
