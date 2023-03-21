import { HttpStatus } from "@nestjs/common";
import { ObjectResult } from "./object-result";

export class OkObjectResult extends ObjectResult {

    constructor(body?: object) {
        super(HttpStatus.OK, body);
    }
}