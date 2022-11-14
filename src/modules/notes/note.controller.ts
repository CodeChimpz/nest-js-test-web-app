import {Controller, Post, Put, Delete, Get, Req, Res, Body, Param} from '@nestjs/common';
import {Request, Response} from 'express';
import {NoteService} from './note.service';
import {WinstonService} from "../logger/winston.service";
import {ResponseObj} from "../../dtos/response";
import {NoteDTO} from "../../dtos/noteDTO";

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
            const response = await this.notesService.findForUser(user, author);
            if (!response) {
                return res.status(404).json(new ResponseObj('no notes found'));
            }
            return res.status(200).json(new ResponseObj('', response.map(note => new NoteDTO(note))));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Put(':user')
    async putNote(@Param('user') user, @Body() body, @Res() res: Response) {
        try {
            const {author, notes} = body;
            const subj = await this.notesService.update(user, author, notes);
            if (!subj) {
                return res.status(404).json(new ResponseObj('no such user'));
            }
            return res.status(200).json(new ResponseObj('updated notes for user', {id: user}));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }

    @Delete('notes')
    async delNote(@Body() body, @Res() res: Response) {
        try {

            const {author, notes, options} = body;
            const subj = await this.notesService.delete(Number(author), notes, options);
            if (!subj) {
                return res.status(404).json(new ResponseObj('no notes found'));
            }
            return res.status(200).json(new ResponseObj('updated your notes'));
        } catch (err) {
            this.logger.log({message: err.message, data: err}, 'error')
            throw err;
        }
    }


}
