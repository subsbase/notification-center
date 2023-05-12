import { Body, Controller, Post } from '@nestjs/common';
import { AuthManager } from '../../managers/auth/auth.manager';
import { BaseController } from '../base-controller';
import { AuthDto } from './auth.dto';
import { IActionResult } from '../response-helpers/action-result.interface';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authManager: AuthManager) {
    super();
  }

  @Post()
  async authenticate(@Body() authDto: AuthDto): Promise<IActionResult> {
    const jwtToken = await this.authManager.signIn(authDto.apiSecret);
    return this.ok(jwtToken);
  }
}
