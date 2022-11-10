import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class Restriction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: null})
    type: string;


    @Column({nullable: true})
    timeout: string;

    @Column({nullable: true})
    setAt: string;


    @OneToOne((type) => User, (user) => user.restriction, {
        orphanedRowAction: 'delete'
    })
    @JoinColumn()
    user: User;

}