import {GroupService} from './group.service';
import {Group} from "./group.entity";
import {User} from "../user/user.entity";
import * as _ from 'lodash'

import {getRandomIntId, getRandomText, prepareDb} from "../../tests/util";

jest.setTimeout(100000)
const collectionSize = Number(process.env.COLLECTION_SIZE) || 1000
describe('GroupService', () => {
    describe(`For ` + collectionSize + ' Entities', () => {
        let service;
        let groups
        beforeAll(async () => {
            const result = await prepareDb({
                target: [GroupService],
                repos: [User, Group]
            }, async (repos, service, entityCount = {users: collectionSize, posts: collectionSize}) => {
                let users = []
                let groups = []
                for (let i = 0; i < entityCount.users; i++) {
                    users.push({
                        name: getRandomText(),
                        email: getRandomText(),
                        password: getRandomText()
                    })
                }
                console.log('Generated users')

                for (let i = 0; i < entityCount.posts; i++) {
                    let usersids = new Set<number>()
                    for (let j = 0; j < 5; j++) {
                        usersids.add(getRandomIntId(entityCount.posts / 10))
                    }
                    groups.push({
                        name: getRandomText(),
                        users: usersids,
                        author: getRandomIntId(entityCount.users)
                    })
                }
                console.log('Generated groups')

                for (const user of users) {
                    await repos.UserRepo.save(user)
                }
                for (const group of groups) {
                    const groupid = await service.create(group, group.author)
                    await service.addTo(groupid, group.users)
                }
                console.log("Updated db")
                return groups
            })
            service = result.returnService
            groups = result.referenceData
        })
        it('should be defined', async () => {
            expect(service).toBeDefined();
        });
        it('finds a Group by id in time', async () => {
            const id = getRandomIntId(collectionSize)
            const group = await service.find(id)
            expect(group).toBeDefined()
            expect(group).toHaveProperty('id', id)
        })

        it('updates a Group metadata in time', async () => {
            const id = getRandomIntId(collectionSize)
            const newshit = {name: getRandomText()}
            await service.update(id, newshit)
            const group = await service.find(id)
            for (const key in Object.keys(newshit)) {
                const value = Object.keys(newshit)[key]
                expect(group).toHaveProperty(value, newshit[value])
            }
        })
        it('deletes all Users then adds Users to a Group in time', async () => {
            const id = getRandomIntId(collectionSize)
            const usersids = []
            for (let i = 0; i < 16; i++) {
                usersids.push(getRandomIntId(collectionSize))
            }
            await service.deleteFrom(id, [], {all: true})
            await service.addTo(id, usersids)
            const group = await service.find(id)
            expect(_.isEqual(new Set(group.users.map(user => user.id)), new Set(usersids))).toBe(true)
        })
    })
})
