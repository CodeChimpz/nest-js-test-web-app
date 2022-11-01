import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import { SecretModule } from '../secret/secret.module';

@Module({
  imports:[
    UserModule,SecretModule
  ],
  providers:[AuthService],
  controllers:[AuthController],
})
export class AuthModule{}