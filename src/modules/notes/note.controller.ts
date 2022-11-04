import {Controller, Post, Put, Delete, Get, Req, Res, Body, Param} from '@nestjs/common';
import {Request, Response} from 'express';
import {NoteService} from './note.service';
import {WinstonService} from "../logger/winston.service";

@Controller('notes')
export class NoteController {
    constructor(
        private notesService: NoteService,
        private logger: WinstonService
    ) {
    }

    @Get(':user')
    async getNotes(@Param('user') user, @Body() body, @Res() res: Response) {
        try {
            const {author} = body
            const response = await this.notesService.findForUser(Number(user), Number(author));
            if (!response) {
                return res.status(404).json({
                    message: 'No notes found',
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

    @Put('note/:user')
    async putNote(@Param('user') user, @Body() body, @Res() res: Response) {
        try {
            const {author, notes} = body;
            const subj = await this.notesService.update(Number(user), Number(author), notes);
            if (!subj) {
                return res.status(404).json({
                    message: 'No such user',
                });
            }
            return res.status(200).json({
                message: `Updated notes for user ${subj}`,
            });
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Delete('note/:user')
    async delNote(@Param('user') user, @Body() body, @Res() res: Response) {
        try {
            const {author, notes, options} = body;
            const subj = await this.notesService.delete(Number(user), Number(author), notes, options);
            if (!subj) {
                return res.status(404).json({
                    message: 'No such notes found for such user',
                });
            }
            return res.status(200).json({
                message: `Updated notes for user ${subj}`,
            });
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }


}
