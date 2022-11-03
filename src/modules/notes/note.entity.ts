import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class Note{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @ManyToOne((type => User),(user)=>user.notes,{
    orphanedRowAction: 'delete',
  })
  user: User

  @ManyToOne((type) => User,(user)=>user.myNotes,{
    orphanedRowAction: 'delete',
  })
  author: User;
}
