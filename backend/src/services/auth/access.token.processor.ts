import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AccessTokenProcessor {

    constructor(private readonly jwtService: JwtService) {}

    generate(payload: object): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    verify(access_token: string) : Promise<object> {
        return this.jwtService.verifyAsync(access_token);
    }

    decode(access_token: string) : any {
        return this.jwtService.decode(access_token);
    }
}