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
                    let users = []
                    let posts = []

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
                    users = await repos.UserRepo.find({})
                    console.log('Generated users')
                    //
                    for (let i = 0; i < entityCount.posts; i++) {
                        const author = users[getRandomIntId(users.length-1)]
                        const newPost = {
                            textContent: getRandomText(),
                            author: author.id,
                        }
                        posts.push(newPost)
                    }
                    for (let i = 0; i < entityCount.posts / 2; i++) {
                        await service.post(posts[i], posts[i].author)
                    }
                    const ops = await repos.PostRepo.find({relations: {originalPoster: true, replies: true}})
                    for (let i = entityCount.posts / 2; i < entityCount.posts; i++) {
                        const op = ops[getRandomIntId(ops.length-1)]
                        await service.comment(posts[i], op.id, posts[i].author)
                    }
                    posts = [...ops, ...await repos.PostRepo.find({relations: {originalPoster: true, replies: true}})]
                    console.log('Generated posts')
                    return {users, posts}
                })
            postService = service.returnService
            posts = service.referenceData.posts
        })
        it('should be defined', async () => {
            expect(postService).toBeDefined();
        });
        it('finds a post by id, returns post, OP and direct replies', async () => {
            const id = posts[getRandomIntId(collectionSize)].id
            const post = await postService.find(id)
            expect(post).toBeDefined()
            expect(post).toBeInstanceOf(Post)
            expect(post).toHaveProperty('originalPoster')
            expect(post).toHaveProperty('replies')
        })
        it('leaves a comment on a Post', async () => {
            const post = posts[getRandomIntId(collectionSize)]
            const originalPost = posts[getRandomIntId(collectionSize)]
            const comment = await postService.comment(post, originalPost.id, post.author)
            const updatedPost = await postService.find(originalPost.id)
            expect(comment).toBeDefined()
            expect(comment).toBeInstanceOf(Post)
            expect(comment).toHaveProperty('mentionedPost.id', originalPost.id)
            expect(updatedPost.replies.map(op => op.id)).toContain(comment.id)
        })

    })
})


