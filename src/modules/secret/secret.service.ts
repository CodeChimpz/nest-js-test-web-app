import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class SecretService {
  private data
  constructor(){
    this.data = JSON.parse(fs.readFileSync('./config/secret.json').toString())
  }
  getData(data:string){
    return this.data[data]
  }
}
