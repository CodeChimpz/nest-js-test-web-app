import {Controller, Post, Get, Body, Res, Param} from "@nestjs/common";
import {Response} from "express";
import {PostService} from "./post.service";

@Controller('posts')
export class PostController {
    constructor(private postsService: PostService) {
    }

    @Post('post')
    async postPost(@Body('post') post, @Body('author') author, @Res() res: Response) {
        try {
            console.log(author)
            const posted = await this.postsService.post(post, author)
            res.status(200).json({message: "successfully posted", content: posted})
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    @Get(':post')
    async getPost(@Param('post') post, @Body('author') author, @Res() res: Response) {
        try {
            const postFound = await this.postsService.find(post)
            res.status(200).json({content: postFound})
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    // @Get(':post/children')
    // async getThread(){
    //
    // }
}