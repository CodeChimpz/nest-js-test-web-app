import {Controller, Post, Req, Res, Body} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';
import {WinstonService} from "../logger/winston.service";
import {ResponseObj} from "../../dtos/response";


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private logger: WinstonService
    ) {
    }

    @Post('register')
    async postRegister(@Body() body, @Res() res: Response): Promise<any> {
        try {
            const result = await this.authService.register(body.user);
            if (!result) {
                return res.status(401).json(new ResponseObj('invalid data or user already exists with such credentials'))
            }
            res.status(200).json(new ResponseObj('successfully signed up'));
        } catch (err) {
            await this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }

    @Post('login')
    async postLogin(@Body() body, @Res() res: Response): Promise<any> {
        try {
            const result = await this.authService.login(body.user);
            if (!result) {
                return res.status(401).json(new ResponseObj('not authenticated ! invalid email or password'))
            }
            this.logger.log({message: 'User logged in', data: {id: result.id}}, 'info')
            res.status(200).json(new ResponseObj('successfully authenticated', result));
        } catch (err) {
            await this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }
}