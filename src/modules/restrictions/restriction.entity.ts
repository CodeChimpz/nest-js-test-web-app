import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Restriction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  timeout: string;

  @OneToOne((type) => User, (user) => user.restriction)
  @JoinColumn()
  user: User;

}