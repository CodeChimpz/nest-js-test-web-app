import * as fs from "fs";
import {Injectable} from "@nestjs/common";

const parseFrom = () => {
    return JSON.parse(fs.readFileSync('./config/secret.json').toString())
}

@Injectable()
export class SecretService {
    data;

    constructor() {
        this.data = parseFrom()
    }

    static getData() {
        return parseFrom()
    }
}