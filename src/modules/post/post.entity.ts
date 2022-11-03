import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    textContent: string

    @OneToMany((type) => Post, (post) => post.replies, {})
    mentionedPosts: Post[]

    @ManyToOne(type => Post, post => post.mentionedPosts, {})
    replies: Post[]

    @ManyToOne(type => User, () => {
    }, {
        eager:true,
        orphanedRowAction: 'delete'
    })
    originalPoster: User
}