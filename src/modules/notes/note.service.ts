import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Note} from './note.entity';
import {User} from '../user/user.entity';
import {Repository, In, QueryBuilder} from 'typeorm';


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

    async delete(user: number, author: number, notes, options) {
        const notesFound = await this.notesRepository.find({
            relations: {
                author: true,
                user: true
            },
            where: {
                user: {id: user},
                author: {id: author}
            },
        });
        const notesToDel = [...new Set([...notes, ...notesFound.map(note => note.id)])]
        await this.notesRepository.delete({id: In(notesToDel)});
        return user
    }

    //add notes to a user
    async update(user: number, author: number, notes: any[]) {
        const userFound = await this.usersRepository.findOneBy({id: user})
        const authorFound = await this.usersRepository.findOneBy({id: author})
        if (!(authorFound || userFound)) {
            return;
        }
        const newNotes = notes.map(note => {
            return {...note, user: userFound, author: authorFound}
        })
        await this.notesRepository.insert(newNotes);
        return user;
    }

    //return all notes for a User
    async findForUser(user: number, author: number): Promise<any> {
        return await this.notesRepository.findOne({
            relations: {
                author: true,
                user: true
            },
            where: {
                user: {id: user},
                author: {id: author}
            },
        });
    }
}
