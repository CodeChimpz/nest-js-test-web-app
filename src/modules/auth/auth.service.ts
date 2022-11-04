import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {UserService} from '../user/user.service';
import {SecretService} from "../../util/secret/secret.service"

//Authentication logic
@Injectable()
export class AuthService {
    constructor(private userService: UserService, private secret: SecretService) {
    }

    async register(user): Promise<any> {
        //todo rework register
        const {password, email} = user;
        const check = await this.userService.checkEmail(email)
        if (check) {
            return;
        }
        user.password = await bcrypt.hash(password, 10);
        await this.userService.create(user);
        return 1;
    }

    async login(user): Promise<any> {
        const {password, email} = user;
        const suspect = await this.userService.checkEmail(email);
        if (!suspect) {
            return;
        }
        const check = await bcrypt.compare(password, suspect.password);
        if (!check) {
            return;
        }
        return {
            token: jwt.sign(JSON.stringify({id: suspect.id, role: suspect.role}), this.secret.data.jwt.bearer),
            id: suspect.id,
        };
    }
}
