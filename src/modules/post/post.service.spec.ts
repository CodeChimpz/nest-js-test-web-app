import {PostService} from './post.service';
import {Post} from "./post.entity";
import {User} from "../user/user.entity";
import {getRandomIntId, getRandomText, prepareDb} from "../../tests/util";


const collectionSize = Number(process.env.COLLECTION_SIZE) || 1000
jest.setTimeout(100000)
describe('PostService', () => {
    describe(`For ` + collectionSize + ' Entities', () => {
        let postService;
        let posts;
        //get the tested Service and referenceData from TestModule
        beforeAll(async () => {
            const service = await prepareDb({
                    target: [PostService],
                    repos: [User, Post]
                },
                async (repos, service, entityCount = {users: 1000, posts: 1000}) => {
                    const users = []
                    const posts = []
                    const postService = service
                    for (let i = 0; i < entityCount.users; i++) {
                        users.push({
                            name: getRandomText(),
                            email: getRandomText(),
                            password: getRandomText()
                        })
                    }
                    console.log('Generated users')
                    //
                    for (let i = 0; i < entityCount.posts; i++) {
                        const newPost = {
                            textContent: getRandomText(),
                            author: getRandomIntId(entityCount.users),
                        }
                        posts.push(newPost)
                    }
                    console.log('Generated posts')
                    //
                    for (const user of users) {
                        await repos.UserRepo.save(user)
                    }
                    for (let i = 0; i < entityCount.posts / 2; i++) {
                        await postService.post(posts[i], posts[i].author)
                    }
                    for (let i = entityCount.posts / 2; i < entityCount.posts; i++) {
                        await postService.comment(posts[i], getRandomIntId(entityCount.posts / 2), posts[i].author)
                    }

                    console.log("Updated db")
                    return posts
                })
            postService = service.returnService
            posts = service.referenceData
        })
        it('should be defined', async () => {
            expect(postService).toBeDefined();
        });
        it('finds a post by id, returns post, OP and direct replies', async () => {
            const id = getRandomIntId(collectionSize)
            const post = await postService.find(id)
            expect(post).toBeDefined()
            expect(post).toBeInstanceOf(Post)
            expect(post).toHaveProperty('originalPoster')
            expect(post).toHaveProperty('replies')
        })
        it('leaves a comment on a Post', async () => {
            const post = posts[getRandomIntId(collectionSize)]
            const originalPostId = getRandomIntId(collectionSize)
            const comment = await postService.comment(post, originalPostId, post.author)
            const originalPost = await postService.find(originalPostId)
            expect(comment).toBeDefined()
            expect(comment).toBeInstanceOf(Post)
            expect(comment).toHaveProperty('mentionedPost.id', originalPostId)
            expect(originalPost.replies.map(op => op.id)).toContain(comment.id)
        })

    })
})


