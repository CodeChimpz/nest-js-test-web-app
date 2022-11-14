import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable} from 'typeorm';
import {User} from './../user/user.entity';
import {type} from 'os';

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @ManyToMany((type) => User)
    @JoinTable({
        joinColumn: {
            name: "group",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user",
            referencedColumnName: "id"
        }
    })
    users: User[];

    @ManyToOne((type) => User)
    author: User;
}