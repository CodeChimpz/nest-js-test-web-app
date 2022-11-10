import {Controller, Post, Put, Delete, Get, Req, Res, Body, Param} from '@nestjs/common';
import {Request, Response} from 'express';
import {RestrictionService} from '../restrictions/restriction.service';
import {WinstonService} from "../logger/winston.service";

@Controller('restrictions')
export class RestrictionController {
    constructor(
        private restrictionService: RestrictionService,
        private logger: WinstonService
    ) {
    }

    @Get(':user')
    async checkBlock(@Param('user') user: number, @Res() res: Response) {
        try {
            const response = await this.restrictionService.check(Number(user));
            if (!response) {
                return res.status(404).json({
                    message: 'No such user',
                });
            }
            return res.status(200).json({
                content: response,
            });
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            return res.status(500).json({
                message: 'Server error',
            });
        }
    }

    @Post(':user')
    async postBlock(@Param('user') user: number, @Body() body, @Res() res: Response) {
        try {
            //todo : dto
            const {restriction} = body;
            await this.restrictionService.declare(Number(user), restriction);
            return res.status(200);
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

}
