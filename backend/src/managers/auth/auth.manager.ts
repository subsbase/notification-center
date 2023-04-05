import { Injectable, Logger } from "@nestjs/common";
import { AuthService } from "../../services/auth/auth.service";

@Injectable()
export class AuthManager {
    constructor(private readonly authService: AuthService) {}
    async signIn() {
        return await this.authService.signIn();
    }
}