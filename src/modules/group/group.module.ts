import {Module} from '@nestjs/common';
import {GroupService} from './group.service';
import {UserModule} from '../user/user.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../user/user.entity';
import {Group} from './group.entity';
import {WinstonModule} from "../logger/winston.module";

@Module({
    imports: [
        WinstonModule,
        TypeOrmModule.forFeature([User, Group]),],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {
}
