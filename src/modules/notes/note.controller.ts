import { Controller, Post, Put, Delete, Get, Req, Res, Body, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(
    private notesService: NoteService,
  ) {
  }

  @Get(':user')
  async getNotes(@Param('user') user, @Res() res: Response) {
    try {
      const response = await this.notesService.findForUser(Number(user));
      if (!response) {
        return res.status(404).json({
          message: 'No such user',
        });
      }
      return res.status(200).json({
        content: response,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('note/:user')
  async postNote(@Param('user') user, @Body() body, @Res() res: Response) {
    try {
      const notes = body.notes;
      const subj = await this.notesService.create(Number(user), notes);
      return res.status(200).json({
        message: `Created note for user ${subj}`,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Put('note/:user')
  async putNote(@Param('user') user, @Body() body, @Res() res: Response) {
    try {
      const notes = body.notes;
      const subj = await this.notesService.update(Number(user), notes);
      if (!subj) {
        return res.status(404).json({
          message: 'No such user',
        });
      }
      return res.status(200).json({
        message: `Updated notes for user ${subj}`,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Delete('note/:user')
  async delNote(@Param('user') user, @Body() body, @Res() res: Response) {
    try {
      const { notes, options } = body;
      const subj = await this.notesService.delete(Number(user), notes, options);
      if (!subj) {
        return res.status(404).json({
          message: 'No such user',
        });
      }
      return res.status(200).json({
        message: `Updated notes for user ${subj}`,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


}
