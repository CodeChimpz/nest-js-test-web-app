import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    textContent: string

    @ManyToOne((type) => Post, (post) => post.replies, {
        cascade:true,
        orphanedRowAction:'delete'
    })
    mentionedPost: Post

    @OneToMany(type => Post, post => post.mentionedPost, {
        onDelete:"CASCADE"
    })
    replies: Post[]

    @ManyToOne(type => User, () => {
    }, {
        eager:true,
        orphanedRowAction: 'delete'
    })
    originalPoster: User
}