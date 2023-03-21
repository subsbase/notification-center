import { HttpStatus } from "@nestjs/common";

export interface IActionResult {
    statusCode: HttpStatus;
    body?: object;
}