import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';


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
    const newGroup = new Group();
    Object.assign(newGroup, group);
    newGroup.author = author;
    await this.groupsRepository.save(newGroup);
    return newGroup.id;
  }

  async delete(id: number, author) {
    await this.groupsRepository.delete(id);
  }

  //update group name
  async update(id: number, groupData, author) {
    const group = await this.groupsRepository.findOne({
      where: {
        id: id,
        author: {
          id: author,
        },
      },
      relations: {
        author: true,
      },
    });
    if (!group) {
      return;
    }
    Object.assign(group,groupData)
    await this.groupsRepository.save(group);
    return group;
  }


  async find(id: number, author): Promise<any> {
    return await this.groupsRepository.find({
      where: { id: id },
      relations: {
        users: true,
      },
    });
  }

  //delete an array of users from a group
  async deleteFrom(id: number, user_ids: number[], author) {
    const group = await this.groupsRepository.findOne({
      where: {
        id: id,
        author: {
          id: author,
        },
      },
      relations: {
        author: true,
        users:true
      },
    });
    if (!group) {
      return;
    }
    group.users = group.users.filter((user) => {
      if (!user_ids.includes(user.id)) {
        return user;
      }
    });
    await this.groupsRepository.save(group);
    return group;
  }

  //add an array of users to a group
  async addTo(id: number, user_ids: number[], author) {
    const group = await this.groupsRepository.findOne({
      where: {
        id: id,
        author: {
          id: author,
        },
      },
      relations: {
        author: true,
        users:true
      },
    });
    if (!group) {
      return;
    }
    for (const u_id of user_ids) {
      const user = await this.usersRepository.findOneBy({ id: u_id });
      if(!group.users.includes(user)){
        group.users.push(user);
      }
    }
    await this.groupsRepository.save(group);
    return group;
  }
}
