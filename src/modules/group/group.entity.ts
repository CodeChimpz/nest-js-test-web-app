import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable} from 'typeorm';
import {User} from './../user/user.entity';
import {type} from 'os';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany((type) => User)
    @JoinTable()
    users: User[];

    @ManyToOne((type) => User)
    author: User;
}