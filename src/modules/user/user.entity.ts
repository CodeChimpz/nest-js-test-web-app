import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, OneToOne, JoinTable } from 'typeorm';
import { Group } from '../group/group.entity';
import { Note } from '../notes/note.entity';
import { Restriction } from '../restrictions/restriction.entity';


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
    default:'USER'
  })
  role: string;

  @OneToOne((type => Restriction), (restriction) => restriction.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  restriction: Restriction;

  @ManyToMany((type) => Group)
  @JoinTable()
  groups: Group[];

  @OneToMany((type) => Group, (group) => group.author,{
    cascade:["update","insert"],
    onDelete:"CASCADE"
  })
  myGroups: Group[];

  @OneToMany((type) => Note, (note) => note.user, {
    cascade: ["insert","update","remove"],
    onDelete: 'CASCADE',
  })
  notes: Note[];
}