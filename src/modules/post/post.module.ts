import {Module} from "@nestjs/common";
import {PostService} from "./post.service";
import {PostController} from "./post.controller";
import {User} from "../user/user.entity";
import {Post} from "./post.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {WinstonModule} from "../logger/winston.module";

@Module({
    imports: [WinstonModule, TypeOrmModule.forFeature([User, Post])],
    providers: [PostService],
    controllers: [PostController]
})
export class PostModule {
}