import {Controller, Post, Put, Delete, Get, Req, Res, Body, Param} from '@nestjs/common';
import {Response} from 'express';
import {GroupService} from './group.service';
import {WinstonService} from "../logger/winston.service";

@Controller('groups')
export class GroupController {
    constructor(private groupsService: GroupService,
                private logger: WinstonService) {
    }

    @Get('groups/:author')
    async getGroupsFor() {
        //add later
    }

    @Get(':group')
    async getGroup(@Param('group') group, @Body() body, @Req() req: any, @Res() res: Response) {
        try {
            const {author} = body;
            const response = await this.groupsService.find(group, author);
            if (!response) {
                return res.status(404).json({
                    message: 'No such group',
                });
            }
            return res.status(200).json({
                content: response,
            });
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
                return res.status(404).json({
                    message: 'you already have a group with such name',
                });
            }
            await this.groupsService.addTo(group, users, author);
            return res.status(200).json({
                message: 'Group created',
                content: group,
            });
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Put(':group/:action')
    async editGroup(@Param('group') group, @Param('action') action, @Body() body, @Res() res: Response) {
        try {
            const {author} = body;
            let response;
            switch (action) {
                case('add'):
                    response = await this.groupsService.addTo(group, body.users, author);
                    break;
                case('delete'):
                    response = await this.groupsService.deleteFrom(group, body.users, author);
                    break;
                case('edit'):
                    response = await this.groupsService.update(group, body.groupData, author);
                    break;
            }
            if (!response) {
                return res.status(404).json({
                    message: 'No such group',
                });
            }
            return res.status(200).json({
                message: 'Group updated',
                content: response,
            });
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Delete(':group')
    async deleteGroup(@Param('group') group, @Body() body, @Res() res: Response) {
        try {
            const {author} = body;
            const response = await this.groupsService.delete(group, author);
            return res.status(200).json({
                message: 'Deleted group',
            });
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }

    }


}
