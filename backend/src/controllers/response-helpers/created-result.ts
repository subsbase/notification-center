import { HttpStatus } from '@nestjs/common';
import { ObjectResult } from './object-result';

export class CreatedObjectResult extends ObjectResult {
  constructor(body?: object) {
    super(HttpStatus.CREATED, body);
  }
}
