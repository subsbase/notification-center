import { FastifyRequest } from '../types/global-types';
import { BadRequestObjectResult } from './response-helpers/bad-request-result';
import { CreatedObjectResult } from './response-helpers/created-result';
import { InternalServerErrorObjectResult } from './response-helpers/internal-server-error-result';
import { NotFoundObjectResult } from './response-helpers/notfound-result';
import { OkObjectResult } from './response-helpers/ok-result';

export abstract class BaseController {
  constructor(protected readonly request: FastifyRequest) {}

  protected get Realm(): string {
    return this.request.headers['x-realm'] as string;
  }

  ok(body?: object): OkObjectResult {
    return new OkObjectResult(body);
  }

  created(body?: object): CreatedObjectResult {
    return new CreatedObjectResult(body);
  }

  notFound(body?: object): NotFoundObjectResult {
    return new NotFoundObjectResult(body);
  }

  badRequest(body?: object): BadRequestObjectResult {
    return new BadRequestObjectResult(body);
  }

  internalServerError(body?: object): InternalServerErrorObjectResult {
    return new InternalServerErrorObjectResult(body);
  }
}
