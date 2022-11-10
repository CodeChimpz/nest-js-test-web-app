import {RestrictionService} from "../restrictions/restriction.service";
import {getRandomIntId, getRandomText, prepareDb} from "../../tests/util";
import {User} from "../user/user.entity";
import {Restriction} from "./restriction.entity";

const generateRestr = (() => {
    let type;
    const def = getRandomIntId(100)
    if (def % 3 == 0) {
        type = null
    } else if (def % 2 == 0) {
        type = 'BLOCK'
    } else {
        type = 'BAN'
    }
    return {
        type: type,
        timeout: getRandomIntId(1000000, 10000),
        setAt: Date.now()
    }
})

jest.setTimeout(100000)
const collectionSize = Number(process.env.COLLECTION_SIZE) || 1000
describe('RestrictionService', () => {
    describe(`For ${collectionSize} Entities`, () => {
        let service;
        beforeAll(async () => {
            const {
                returnService
            } = await prepareDb({
                target: [RestrictionService],
                repos: [User, Restriction]
            }, async (repos, service: RestrictionService, entityCount = {users: 1000}) => {
                const users = []
                const repo = repos.UserRepo
                const usNum = entityCount.users
                for (let i = 0; i < usNum; i++) {
                    users.push({
                        name: getRandomText(),
                        email: getRandomText(),
                        password: getRandomText()
                    })
                }
                for (const user of users) {
                    await repo.save(repo.create(user))
                }
                for (let i = 0; i < usNum; i++) {
                    await service.declare(i, generateRestr())
                }
            })
            service = returnService
        });

        it('should be defined', async () => {
            expect(service).toBeDefined();
        });
        it('should return Restriction Object with consistent structure', async () => {
            const restr = await service.check(getRandomIntId(collectionSize))
            expect(restr).toHaveProperty('type')
            expect(restr).toHaveProperty('timeout')
            expect(restr).toHaveProperty('setAt')
        });
        it('should update and delete a Restriction if passed an empty "restriction" param', async () => {
            const id = getRandomIntId(collectionSize)
            const restr = await service.declare(id)
            const check = await service.check(id)
            expect(check).toHaveProperty('type', null)
        });
        it('should update a Restriction otherwise', async () => {
            const id = getRandomIntId(collectionSize)
            const gen = generateRestr()
            const restr = await service.declare(id, gen)
            const check = await service.check(id)
            expect(check).toHaveProperty('type', gen.type)
        })

    })
});