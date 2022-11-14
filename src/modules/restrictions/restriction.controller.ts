import {Controller, Post, Put, Delete, Get, Req, Res, Body, Param} from '@nestjs/common';
import {Request, Response} from 'express';
import {RestrictionService} from '../restrictions/restriction.service';
import {WinstonService} from "../logger/winston.service";
import {ResponseObj} from "../../dtos/response";

@Controller('restrictions')
export class RestrictionController {
    constructor(
        private restrictionService: RestrictionService,
        private logger: WinstonService
    ) {
    }

    @Get(':user')
    async checkBlock(@Param('user') user, @Res() res: Response) {
        try {
            const response = await this.restrictionService.check(user);
            if (!response) {
                return res.status(404).json({
                    message: 'No such user',
                });
            }
            return res.status(200).json(new ResponseObj('', response));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err
        }
    }

    @Post(':user')
    async postBlock(@Param('user') user, @Body() body, @Res() res: Response) {
        try {
            const {restriction} = body;
            await this.restrictionService.declare(user, restriction);
            this.logger.log({
                message: "Restriction placed on user",
                data: {restriction: restriction, user: user}
            }, 'info')
            return res.status(200).json(new ResponseObj("Restriction placed"));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

}
