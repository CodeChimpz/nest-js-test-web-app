import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {SecretModule} from '../../util/secret/secret.module';
import {WinstonModule} from "../logger/winston.module";

@Module({
    imports: [
        UserModule, SecretModule, WinstonModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {
}