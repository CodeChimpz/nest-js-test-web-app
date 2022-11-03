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

    async find(id: number) {
        return await this.postsRepository.findOne({
            where: {
                id: id
            },
            relations: {
                mentionedPosts: true
            }
        })
    }

    async post(postData, author) {
        const newPost = this.postsRepository.create({...postData, originalPoster: author})
        await this.postsRepository.save(newPost)
        return newPost
    }

}