import {Controller, Post, Req, Res, Body} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('register')
    async postRegister(@Body() body): Promise<string> {
        try {
            const result = await this.authService.register(body.user);
            if (!result) {
                return "Invalid data or such user already exists"
            }
            return 'Successfully registered user';
        } catch (err) {
            console.log(err);
            return 'An error has occured';
        }
    }

    @Post('login')
    async postLogin(@Body() body, @Res() res: Response) {
        try {
            const result = await this.authService.login(body.user);
            if (!result) {
                return res.status(404).json({
                    message: 'Not authenticated! Invalid email or password.',
                });
            }
            res.status(200).json({
                data: result,
            });
        } catch (err) {
            console.log(err);
            return {message: 'An error has occured'};
        }
    }
}