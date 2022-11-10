import {Controller, Post, Req, Res, Body} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';
import {WinstonService} from "../logger/winston.service";


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
                await this.logger.log({message: "Failed register", data: body.user, status: 401}, 'http')
                return res.status(401).json({
                    message: "" +
                        "Invalid data or such user already exists"
                })
            }
            res.status(200).json({
            message:'successfully authenticated'
        });
        } catch (err) {
            await this.logger.log({message: err.message, data: err}, 'error')
            return res.status(500).json({message: 'An error has occured'});
        }
    }

    @Post('login')
    async postLogin(@Body() body, @Res() res: Response): Promise<any> {
        try {
            const result = await this.authService.login(body.user);
            if (!result) {
                await this.logger.log({message: "Failed authentication", data: body.user, status: 401}, 'http')
                return res.status(401).json({
                    message: "" +
                        "Not authenticated! Invalid email or password."
                })
            }
            res.status(200).json({
                data: result,
            });
        } catch (err) {
            await this.logger.log({message: err.message, data: err}, 'error')
            return res.status(500).json({message: 'An error has occured'});
        }
    }
}