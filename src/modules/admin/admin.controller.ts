import { Controller, Post, Req, Res, Body, Get} from '@nestjs/common';
import { Request, Response } from 'express';


@Controller()
export class AdminController{
  @Get('hello')
  async hello(){
    return "Hello, you are an admin"
  }
}



