import { HttpStatus } from '@nestjs/common';
import { ObjectResult } from './object-result';

export class InternalServerErrorObjectResult extends ObjectResult {
  constructor(body?: object) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, body);
  }
}
