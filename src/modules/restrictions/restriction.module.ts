import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {RestrictionService} from './restriction.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../user/user.entity';
import {Restriction} from './restriction.entity';
import {WinstonModule} from "../logger/winston.module";

@Module({
    imports: [
        WinstonModule,
        TypeOrmModule.forFeature([User, Restriction]),
    ],
    providers: [RestrictionService],
    exports: [RestrictionService],
})
export class RestrictionModule {
}