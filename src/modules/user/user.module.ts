import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from './user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {WinstonModule} from "../logger/winston.module";

@Module({
    imports: [WinstonModule, TypeOrmModule.forFeature([User])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}