export class ResponseObj{
    message: string
    content : any
    constructor(msg = '',content = {}) {
        this.message = msg
        this.content = content
    }
}