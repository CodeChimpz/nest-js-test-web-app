import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, OneToOne, JoinTable} from 'typeorm';
import {Group} from '../group/group.entity';
import {Note} from '../notes/note.entity';
import {Restriction} from '../restrictions/restriction.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({
        default: 'USER'
    })
    role: string;

    @OneToOne((type => Restriction), (restriction) => restriction.user, {
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
        cascade: ['update'],
    })
    restriction: Restriction;

    @ManyToMany((type) => Group)
    @JoinTable()
    groups: Group[];

    @OneToMany((type) => Group, (group) => group.author, {
        cascade: true,
        onDelete: "CASCADE"
    })
    myGroups: Group[];

    @OneToMany((type) => Note, (note) => note.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    notes: Note[];

    @OneToMany((type) => Note, (note) => note.author, {
        cascade: true,
        onDelete: "CASCADE"
    })
    myNotes: Group[];
}