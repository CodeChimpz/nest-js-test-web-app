import {getRandomIntId, getRandomText, prepareDb} from "../../tests/util";
import {RestrictionService} from "../restrictions/restriction.service";
import {User} from "../user/user.entity";
import {Note} from "./note.entity";
import {NoteService} from "./note.service";

jest.setTimeout(100000)
const collectionSize = Number(process.env.COLLECTION_SIZE) || 1000
describe('NoteService', () => {
    describe(`For ${collectionSize} Entities`, () => {
        let service;
        beforeAll(async () => {
            const {
                returnService
            } = await prepareDb({
                target: [NoteService],
                repos: [User, Note]
            }, async (repos, service: NoteService, entityCount = {
                users: collectionSize,
                notes: collectionSize / 100
            }) => {
                const users = []
                const notes = []
                const repo = repos.UserRepo
                const usNum = entityCount.users
                for (let i = 0; i < usNum; i++) {
                    const user = {
                        name: getRandomText(),
                        email: getRandomText(),
                        password: getRandomText()
                    }
                    users.push(user)

                    await repo.save(repo.create(user))
                }
                for (let i = 1; i < usNum; i++) {
                    const notes_ = []
                    for (let j = 0; j < entityCount.notes; j++) {
                        const note = {content: getRandomText()}
                        notes_.push(note)
                        notes.push(note)
                    }
                    await service.update(i, getRandomIntId(entityCount.users), notes_)

                }
                return [notes, users]
            })
            service = returnService
        });

        it('should be defined', async () => {
            expect(service).toBeDefined();
        });
    })
});