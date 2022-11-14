import {UserDTO} from "./userDTO";

export class GroupDto {
    id: string
    name: string
    author: UserDTO
    users: UserDTO[] = []

    constructor(obj) {
        this.id = obj.id
        this.name = obj.name
        this.author = new UserDTO(obj.author)
        for (const user of obj.users) {
            this.users.push(new UserDTO(user))
        }
    }
}