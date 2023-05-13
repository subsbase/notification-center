import { HttpStatus } from '@nestjs/common';
import { IActionResult } from './action-result.interface';

export abstract class ObjectResult implements IActionResult {
  statusCode: HttpStatus;
  body?: object | undefined;

  constructor(statusCode: HttpStatus, body?: object) {
    this.statusCode = statusCode;
    this.body = body;
  }
}
