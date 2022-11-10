import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Group} from './group.entity';
import {User} from '../user/user.entity';
import {Repository} from 'typeorm';


//crud on user groups
@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupsRepository: Repository<Group>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    //initialize without users
    async create(group, author) {
        const check = await this.groupsRepository.findOne({
            relations: {
                author: true,
            },
            where: {
                name: group.name,
                author: {
                    id: author,
                },
            },
        });
        if (check) {
            return;
        }
        const newGroup = this.groupsRepository.create({
            name: group.name,
            author
        });
        await this.groupsRepository.save(newGroup);
        return newGroup.id;
    }

    async delete(id: number) {
        await this.groupsRepository.delete(id);
    }

    async find(id: number) {
        return await this.groupsRepository.findOne({
            where: {id: id},
            relations: {
                users: true,
            },
        });
    }

    //update group name
    async update(id: number, groupData) {
        const group = await this.groupsRepository.findOne({
            where: {
                id: id,
            }
        });
        if (!group) {
            return;
        }
        Object.assign(group, groupData)
        await this.groupsRepository.save(group);
        return group;
    }


    //delete an array of users from a group
    async deleteFrom(id: number, user_ids: number[], options = {all: null}) {
        const group = await this.groupsRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                users: true
            },
        });
        if (!group) {
            return;
        }
        if (options.all) {
            group.users = []
        } else {
            group.users = group.users.filter((user) => {
                if (!user_ids.includes(user.id)) {
                    return user;
                }
            });
        }
        await this.groupsRepository.save(group);
        return group;
    }

    //add an array of users to a group
    async addTo(id: number, user_ids: number[]) {
        const group = await this.groupsRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                users: true
            },
        });
        if (!group) {
            return;
        }
        for (const u_id of user_ids) {
            const user = await this.usersRepository.findOneBy({id: u_id});
            if (user && !group.users.find(user => {
                return u_id === user.id
            })) {
                group.users.push(user);
            }
        }
        await this.groupsRepository.save(group);
        return group;
    }

    //get all Authors groups
    async getAll(author: number) {
        return await this.groupsRepository.find({
            relations: {
                users: true,
                author: true
            }, where: {
                author: {
                    id: author
                }
            }
        })
    }
}
