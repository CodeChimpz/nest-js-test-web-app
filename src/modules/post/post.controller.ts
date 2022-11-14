import {Controller, Post, Get, Body, Res, Param} from "@nestjs/common";
import {Response} from "express";
import {PostService} from "./post.service";
import {WinstonService} from "../logger/winston.service";
import {ResponseObj} from "../../dtos/response";
import {PostDto} from "../../dtos/postDTO";

@Controller('posts')
export class PostController {
    constructor(private postsService: PostService,
                private logger: WinstonService) {
    }

    @Post('post')
    async postPost(@Body('post') post, @Body('author') author, @Res() res: Response) {
        try {
            const posted = await this.postsService.post(post, author)
            res.status(200).json(new ResponseObj("successfully posted", new PostDto(posted)))
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }

    @Get(':post')
    async getPost(@Param('post') post, @Body('author') author, @Res() res: Response) {
        try {
            const postFound = await this.postsService.find(post)
            res.status(200).json(new ResponseObj('', new PostDto(postFound)))
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }

    @Post(':post/comment')
    async postComment(@Param('post') post, @Body('author') author, @Body('data') data, @Res() res: Response) {
        try {
            const newPost = await this.postsService.comment(data, post, author)
            if (!newPost) {
                return res.status(404).json(new ResponseObj('no post found'))
            }
            return res.status(200).json(new ResponseObj('posted comment', new PostDto(newPost)))
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }
}