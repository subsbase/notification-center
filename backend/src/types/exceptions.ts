
export class InvalidArgumentError extends Error {
    
    constructor(argName: string, message?: string){
        if(message){
            super(message)
        }else{
            super(`invalid argument ${argName}`)
        }
    }
}