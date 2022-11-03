import {Module} from "@nestjs/common";
import {PostService} from "./post.service";
import {PostController} from "./post.controller";
import {User} from "../user/user.entity";
import {Post} from "./post.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([User, Post])],
    providers: [PostService],
    controllers: [PostController]
})
export class PostModule {
}