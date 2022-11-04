import {Controller, Post, Get, Body, Res, Param} from "@nestjs/common";
import {Response} from "express";
import {PostService} from "./post.service";
import {WinstonService} from "../logger/winston.service";

@Controller('posts')
export class PostController {
    constructor(private postsService: PostService,
                private logger: WinstonService) {
    }

    @Post('post')
    async postPost(@Body('post') post, @Body('author') author, @Res() res: Response) {
        try {
            console.log(author)
            const posted = await this.postsService.post(post, author)
            res.status(200).json({message: "successfully posted", content: posted})
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }

    @Get(':post')
    async getPost(@Param('post') post, @Body('author') author, @Res() res: Response) {
        try {
            const postFound = await this.postsService.find(post)
            res.status(200).json({content: postFound})
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }

    // @Get(':post/children')
    // async getThread(){
    //
    // }
}