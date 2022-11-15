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
        let notes;
        let users;
        let note;
        let user;
        beforeAll(async () => {
            const {
                returnService, referenceData
            } = await prepareDb({
                    target: [NoteService],
                    repos: [User, Note]
                },
                async (repos, service: NoteService, entityCount = {
                    users: collectionSize,
                    notes: collectionSize / 100
                }) => {
                    let users = []
                    let notes = []

                    for (let i = 0; i < entityCount.users; i++) {
                        users.push({
                            name: getRandomText(),
                            email: getRandomText(),
                            password: getRandomText()
                        })
                    }
                    for (const user of users) {
                        await repos.UserRepo.save(user)
                    }
                    users = await repos.UserRepo.find({relations: {notes: true}})
                    console.log('Generated users')

                    for (let i = 1; i < 10; i++) {
                        const notes_ = []
                        for (let j = 0; j < entityCount.notes; j++) {
                            const note = {content: getRandomText()}
                            notes_.push(note)
                            notes.push(note)
                        }
                        await service.update(i, users[getRandomIntId(entityCount.users)].id, notes_)
                    }
                    notes = await repos.NoteRepo.find({
                            relations: {author: true}
                        }
                    )
                    console.log("Generated notes")

                    return {users, notes}
                })
            service = returnService
            notes = referenceData.notes
            users = referenceData.users
            note = notes[getRandomIntId(collectionSize / 100)]
            user = users[getRandomIntId(collectionSize)]
        });

        it('should be defined', async () => {
            expect(service).toBeDefined();
        });

        describe('find', () => {
            it('should find all notes this admin made for a user', async () => {
                const result = await service.findForUser(note.author.id, user.id)
                expect(result).toBeDefined();
                if (result.length) {
                    expect(result.map(note => note.id)).toContain(user.notes.map(note => note.id))
                }
            })
        })

        describe('update', () => {
            it('should add notes to user', async () => {
                const notes = []
                for (let j = 0; j < 10; j++) {
                    const note = {content: getRandomText()}
                    notes.push(note)
                }
                const result = await service.update(user.id, note.author.id, notes)
                expect(result).toBeDefined()
                const check = await service.findForUser(user.id, note.author.id)
                console.log(check)
                expect(check).toBeDefined();
                expect(check.map(note => note.content).sort()).toEqual(notes.map(note => note.content).sort())
            })

            it('should return falsey value if a nonexistent author is specified', async () => {
                const result = await service.update(user.id, 'aaaaaaa', [])
                expect(result).not.toBeDefined()
            })
        })

        describe('delete', () => {
            it('should delete notes from user', async () => {
                const result = await service.delete(note.author.id, [], {all: true})
                expect(result).toBeDefined()
                const check = await service.findForUser(user.id, note.author.id)
                expect(check).toBeDefined();
                expect(check.map(note => note.content).sort()).not.toEqual(notes.map(note => note.content).sort())
            })
            it('should return falsey value if a nonexistent author is specified', async () => {
                const result = await service.update(user.id, 'aaaaaaa', [])
                expect(result).not.toBeDefined()
            })
        })
    })
})
;