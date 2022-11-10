import * as crypto from "crypto";
import {Post} from "../modules/post/post.entity";
import {User} from "../modules/user/user.entity";
import {SecretService} from "../util/secret/secret.service";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restriction} from "../modules/restrictions/restriction.entity";
import {Group} from "../modules/group/group.entity";
import {Note} from "../modules/notes/note.entity";

export function getRandomIntId(max, min = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getRandomText() {
    return crypto.randomBytes(20).toString('hex')
}

interface ModuleOptions {
    //The repos we need to get from the Test Module
    target: any,
    //Array of TypeORM entity classes that we need to get from Test Module for DB population
    repos: any[]
}

//Wrapper for DB connection for Jest testing, accepts module Options and a function with DB population logic
//Repositories that the populatorFunc requires should be defined in moduleOptions.repos
//Returns the Service object and the array of Entities needed for test result validation from populatorFunc
export async function prepareDb(moduleOptions: ModuleOptions,
                                //Should populate the DB with needed values and return created entries for reference and testing
                                //Is passed returnService and returnRepos by the wrapper
                                populatorFunc: (
                                    //Each repo will have a name with a template of ClassName+'Repo' : UserRepo, PostRepo e.g
                                    repos: any
                                    , service: any, ...args) => any) {
    //target service and the auxilarry repos
    let services = moduleOptions.target;
    const repos = moduleOptions.repos
    //Connect to test database
    const dbData = SecretService.getData().dbConnectionData
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'mysql',
                ...dbData.test,
                entities: [Post, User, Restriction, Group, Note],
                synchronize: true,
                dropSchema: process.env.DROP ?? true,
            }),
            TypeOrmModule.forFeature(repos)
        ],
        providers: [...services],
    }).compile();
    //Get the needed providers and Repositories from the module

    let returnService;
    if (services.length == 1) {
        returnService = await module.resolve(services[0])
    } else {
        returnService = {}
        for (const service of services) {
            returnService[`${service.name}`] = await module.resolve(service)
        }
    }
    const returnRepos = {}
    for (const repo of repos) {
        returnRepos[`${repo.name}Repo`] = await module.resolve(`${repo.name}Repository`)
    }
    //Call the DB population function with requested Repos
    const referenceData = await (async function (...args) {
        return await populatorFunc(returnRepos, returnService, ...args)
    })()
    return {returnService, referenceData}

}