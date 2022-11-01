import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User_IF } from '../../interfaces/user.interface';
import { UserService } from '../user/user.service';
import { SecretService } from '../secret/secret.service';

//Authentication logic
@Injectable()
export class AuthService {
  constructor(private userService: UserService, private secret: SecretService) {
  }

  async register(user: User_IF): Promise<any> {
    //todo rework register
    const { password, email } = user;
    user.password = await bcrypt.hash(password, 10);
    await this.userService.create(user);
    return 1;
  }

  async login(user: User_IF): Promise<any> {
    const { id, password, email } = user;
    const suspect = await this.userService.find(id);
    if (!suspect) {
      return;
    }
    const check = await bcrypt.compare(password, suspect.password);
    if (!check) {
      return;
    }
    return {
      token: jwt.sign(JSON.stringify({ name: suspect.name, role: '' }), this.secret.getData('jwt').bearer),
      id: suspect.id,
    };
  }
}
