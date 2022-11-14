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

    async delete(author, notes, options) {
        if (options.all) {
            const authorFound = await this.usersRepository.findOne({
                where: {
                    id: author
                },
                relations: {
                    notes: true
                }
            })
            authorFound.notes = []
            await this.usersRepository.save(authorFound)
            return 1;
        }
        await this.notesRepository.delete({id: In(notes.map(note => String(note)))});
        return 1;
    }

    //add notes to a user
    async update(user, author, notes: any[]) {
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
    async findForUser(user, author): Promise<any> {
        return await this.notesRepository.find({
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
