import * as Transport from "winston-transport";
import {Injectable} from "@nestjs/common";
import {Log} from "./log.entity";
import {EntityManager, Repository} from "typeorm";
import {InjectDataSource, InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

@Injectable()
export class MysqlTransport extends Transport {
    constructor(
        @InjectRepository(Log,'logger_db')
        private logsRepository : Repository<Log>
    ) {
        super()
    }

    async log(info, callback) {
        await this.logsRepository.insert(info)
        setImmediate(() => {
            this.emit('logged', info);
        });
    }
};