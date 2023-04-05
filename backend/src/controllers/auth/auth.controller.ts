import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthManager } from '../../managers/auth/auth.manager';
import { BaseController } from '../base-controller';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authManager: AuthManager) {
    super();
  }

  @Post('login')
  signIn() {
    const jwtToken = this.authManager.signIn()
    return this.ok(jwtToken);
  }
}