import {UserDTO} from "./userDTO";

export class NoteDTO {
    id: string
    content: string
    user: UserDTO
    author: UserDTO

    constructor(obj) {
        this.id = obj.id
        this.content = obj.content
        this.author = new UserDTO(obj.author)
        this.user = new UserDTO(obj.user)
    }

}