import {Injectable} from "@nestjs/common";
import {Post} from "./post.entity";
import {User} from "../user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {
    }

    async find(id: string) {
        return await this.postsRepository.findOne({
            where: {
                id: id
            },
            relations: {
                replies: true,
                originalPoster: true
            }
        })
    }

    async post(postData, author) {
        const newPost = this.postsRepository.create({...postData, originalPoster: author})
        await this.postsRepository.save(newPost)
        return newPost
    }

    async comment(postData, post, author) {
        const mentioned = await this.postsRepository.findOneBy({id: post})
        if (!mentioned) {
            return;
        }
        const newPost = this.postsRepository.create({...postData, mentionedPost: mentioned, originalPoster: author})
        await this.postsRepository.save(newPost)
        return newPost
    }


}