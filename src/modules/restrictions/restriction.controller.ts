import { Controller, Post, Put, Delete, Get, Req, Res, Body, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { RestrictionService } from '../restrictions/restriction.service';

@Controller('restrictions')
export class RestrictionController {
  constructor(
    private restrictionService: RestrictionService,
  ) {
  }

  @Get(':user')
  async checkBlock(@Param('user') user:  number, @Res() res: Response){
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
      console.log(err);
      //todo: error handling
      throw(err);
    }
  }

  @Post(':user')
  async postBlock(@Param('user') user:  number, @Body() body, @Res() res: Response) {
    try {
      const check = await this.restrictionService.check(Number(user));
      if (!check) {
        return res.status(404).json({
          message: 'No such user',
        });
      }
      //todo : dto
      const { value, timeout } = body;
      await this.restrictionService.declare(Number(user), { body, timeout });
      return res.status(200);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}
