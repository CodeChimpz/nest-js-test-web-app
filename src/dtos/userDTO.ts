import {GroupDto} from "./groupDTO";

export class UserDTO{
    id: string
    name: string

    constructor(obj){
        this.id = obj.id
        this.name = obj.name

    }
}