import { HttpStatus } from '@nestjs/common';
import { ObjectResult } from './object-result';

export class BadRequestObjectResult extends ObjectResult {
  constructor(body?: object) {
    super(HttpStatus.BAD_REQUEST, body);
  }
}
