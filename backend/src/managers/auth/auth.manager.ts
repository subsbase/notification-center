import { Injectable } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthManager {
  constructor(private readonly authService: AuthService) {}

  async signIn(apiSecret: string): Promise<any> {
    const access_token = await this.authService.authenticateWithApiSecret(apiSecret);

    return {
      access_token,
    };
  }
}
