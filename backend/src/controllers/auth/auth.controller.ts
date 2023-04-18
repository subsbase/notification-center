import { Body, Controller, Inject, Post } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthManager } from '../../managers/auth/auth.manager';
import { BaseController } from '../base-controller';
import { AuthDto } from './auth.dto';
import { IActionResult } from '../response-helpers/action-result.interface';
import { FastifyRequest } from '../../types/global-types';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    @Inject(REQUEST) protected readonly request: FastifyRequest,
    private readonly authManager: AuthManager) {
    super(request);
  }
  
  @Post()
  async authenticate(@Body() authDto: AuthDto) : Promise<IActionResult> {
    const jwtToken = await this.authManager.signIn(authDto.apiSecret)
    return this.ok(jwtToken);
  }
}