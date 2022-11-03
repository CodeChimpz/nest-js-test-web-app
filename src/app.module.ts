import {Module, MiddlewareConsumer} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {AdminModule} from './modules/admin/admin.module';
import {CheckAccess, CheckAdmin} from './middleware/authentication.middleware'
import {User} from './modules/user/user.entity';
import {Restriction} from './modules/restrictions/restriction.entity';
import {Group} from './modules/group/group.entity';
import {Note} from './modules/notes/note.entity';
import {SecretModule} from "./modules/secret/secret.module";
import {PostModule} from "./modules/post/post.module";
import * as dotenv from 'dotenv'
import {Post} from "./modules/post/post.entity";

dotenv.config({path: './config/.env'})

const {MONGO_USER, MONGO_HOST, MONGO_PORT, MONGO_PASSWORD, MONGO_BASE} = process.env
console.log(MONGO_USER, MONGO_HOST, MONGO_PORT, MONGO_PASSWORD, MONGO_BASE)

@Module({
    //todo : env variables
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: MONGO_HOST,
            port: Number(MONGO_PORT),
            username: MONGO_USER,
            password: MONGO_PASSWORD,
            database: MONGO_BASE,
            entities: [Note, Group, User, Restriction, Post],
            synchronize: true,
        }), UserModule,
        AuthModule,
        AdminModule,
        SecretModule,
        PostModule
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckAccess)
            .exclude('auth')
            .forRoutes('*')
        consumer
            .apply(CheckAdmin)
            .forRoutes('admin')
    }
}
