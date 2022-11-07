import {Module} from "@nestjs/common";
import {WinstonService} from "./winston.service";
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
    providers: [
        WinstonService],
    exports: [
        WinstonService
    ]
})
export class WinstonModule {
}