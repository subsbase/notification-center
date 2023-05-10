import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InvalidArgumentError } from "../../types/exceptions";

@Injectable()
export class AccessTokenProcessor {

    constructor(private readonly jwtService: JwtService) {}

    generate(payload: object): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    verify(access_token: string) : Promise<object> {
        if(this.isEmptyToken(access_token)){
            throw new InvalidArgumentError('access_token')
        }
        return this.jwtService.verifyAsync(access_token);
    }

    decode(access_token: string) : any {
        return this.jwtService.decode(access_token);
    }

    private isEmptyToken(access_token: string): boolean{
        return access_token.trim().length <= 0
    }
}