import { HttpStatus } from '@nestjs/common';
import { ObjectResult } from './object-result';

export class NotFoundObjectResult extends ObjectResult {
  constructor(body?: object) {
    super(HttpStatus.NOT_FOUND, body);
  }
}
