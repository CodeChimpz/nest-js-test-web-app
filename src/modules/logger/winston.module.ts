import {Module} from "@nestjs/common";
import {WinstonService} from "./winston.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Log} from "./db/log.entity";
import {MysqlTransport} from "./db/winston.mysql.transport";


@Module({
    imports: [
        TypeOrmModule.forFeature([Log],
           'logger_db'
        )
    ],
    providers: [
        WinstonService, MysqlTransport],
    exports: [
        WinstonService
    ]
})
export class WinstonModule {
}