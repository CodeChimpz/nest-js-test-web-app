import {Module, MiddlewareConsumer} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {AdminModule} from './modules/admin/admin.module';
import {CheckAccess, CheckAdmin} from './middleware/authentication.middleware'
import {PostModule} from "./modules/post/post.module";
import * as dotenv from 'dotenv'
import {Note} from "./modules/notes/note.entity";
import {Group} from "./modules/group/group.entity";
import {User} from "./modules/user/user.entity";
import {Restriction} from "./modules/restrictions/restriction.entity";
import {Post} from "./modules/post/post.entity";
import {SecretModule} from "./util/secret/secret.module";
import {SecretService} from "./util/secret/secret.service";
import {WinstonModule} from "./modules/logger/winston.module";
import * as fs from "fs";

dotenv.config({path: './config/.env'})
const dbData = SecretService.getData().dbConnectionData

@Module({
    //todo : env variables
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            ...dbData.default,
            entities: [Note, Group, User, Restriction, Post],
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        AdminModule,
        PostModule,
        SecretModule,
        WinstonModule
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckAccess)
            .exclude('path')
            .forRoutes('.*')
        consumer
            .apply(CheckAdmin)
            .forRoutes('admin')
    }
}
