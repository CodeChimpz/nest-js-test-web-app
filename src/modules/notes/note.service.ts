import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';


//crud on notes
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
  }

  //create one or more notes for a user
  async create(id: number, notes: any[]) {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      return;
    }
    user.notes = notes;
    await this.usersRepository.save(user);
    return user;
  }

  async delete(id: number, notes: any[], options) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        notes: true,
      },
    });
    if (!user) {
      return;
    }
    user.notes = options.all ? [] : user.notes.filter(note => {
      if (!notes.find(del => {
        return del.id == note.id;
      })) {
        return note;
      }
    });
    await this.usersRepository.save(user);
    return user.id;
  }

  //add notes to a user
  async update(id: number, notes: any[]) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        notes: true,
      },
    });
    if (!user) {
      return;
    }
    user.notes.push(...notes);
    await this.usersRepository.save(user);
    return user.id;
  }

  //return all notes for a User
  async findForUser(id: number): Promise<any> {
    return await this.usersRepository.findOne({
      relations: {
        notes: true,
      },
      where: {
        id: id,
      },
    });
  }
}
