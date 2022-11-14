import {UserDTO} from "./userDTO";

export class PostDto {
    id: string
    text: string
    replies: PostDto[] = []
    originalPoster: UserDTO

    constructor(obj) {
        this.id = obj.id
        this.text = obj.text
        if(obj.replies){
            for (const reply of obj.replies) {
                this.replies.push(new PostDto(reply))
            }
        }
        this.originalPoster = new UserDTO(obj.originalPoster)
    }
}