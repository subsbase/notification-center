
export class InvalidArgumentError extends Error {
    constructor(argName: string){
        super(`invalid argument ${argName}`)
    }
}