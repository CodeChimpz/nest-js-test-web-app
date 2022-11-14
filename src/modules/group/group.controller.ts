import {Controller, Post, Put, Delete, Get, Req, Res, Body, Param} from '@nestjs/common';
import {Response} from 'express';
import {GroupService} from './group.service';
import {WinstonService} from "../logger/winston.service";
import {ResponseObj} from "../../dtos/response";
import {GroupDto} from "../../dtos/groupDTO";

@Controller('groups')
export class GroupController {
    constructor(private groupsService: GroupService,
                private logger: WinstonService) {
    }

    @Get('my')
    async getGroupsFor(@Param('author') author, @Res() res: Response) {
        try {
            const result = await this.groupsService.getAll(author)
            return res.status(200).json(new ResponseObj('my groups', result.map(group => new GroupDto(group))))
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Get(':group')
    async getGroup(@Param('group') group, @Req() req: any, @Res() res: Response) {
        try {
            const response = await this.groupsService.find(group);
            if (!response) {
                return res.status(404).json(new ResponseObj('no such group'));
            }
            return res.status(200).json(new ResponseObj('', new GroupDto(response)));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Post('group')
    async crateGroup(@Body() body, @Res() res: Response) {
        try {
            const {groupData, users, author} = body;
            const group = await this.groupsService.create(groupData, author);
            if (!group) {
                return res.status(400).json(new ResponseObj('you already have a group with such name'));
            }
            await this.groupsService.addTo(group, users);
            return res.status(200).json(new ResponseObj('group created', {id: group}
            ));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Put(':group/:action')
    async editGroup(@Param('group') group, @Param('action') action, @Body() body, @Res() res: Response) {
        try {
            let response;
            switch (action) {
                case('add'):
                    response = await this.groupsService.addTo(group, body.users);
                    break;
                case('delete'):
                    response = await this.groupsService.deleteFrom(group, body.users);
                    break;
                case('edit'):
                    response = await this.groupsService.update(group, body.groupData);
                    break;
            }
            if (!response) {
                return res.status(404).json(new ResponseObj('no such user or group'));
            }
            return res.status(200).json(new ResponseObj('group updated', new GroupDto(response)));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Delete(':group')
    async deleteGroup(@Param('group') group, @Res() res: Response) {
        try {
            await this.groupsService.delete(group);
            return res.status(200).json(new ResponseObj('deleted group'));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }

    }


}
