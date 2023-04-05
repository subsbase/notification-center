import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  async signIn() {
    const userSecretKey = process.env.USER_SECRET_KEY
    const payload = { userSecretKey: userSecretKey };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}