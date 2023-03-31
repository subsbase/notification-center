import { lastValueFrom, of, tap } from "rxjs";
import { HttpStatus } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { CallHandler } from "@nestjs/common/interfaces/features/nest-interceptor.interface";
import { createMock } from '@golevelup/ts-jest';
import { ResponseInterceptor } from "../../../src/interceptors/response.interceptor"
import { IActionResult } from "../../../src/controllers/response-helpers/action-result.interface";
import { NotFoundObjectResult } from "../../../src/controllers/response-helpers/notfound-result";
import { InternalServerErrorObjectResult } from "../../../src/controllers/response-helpers/internal-server-error-result";
import { CreatedObjectResult } from "../../../src/controllers/response-helpers/created-result";

describe('Response Interceptor', () => {
    let interceptor: ResponseInterceptor
  
    beforeEach(() => {
      interceptor = new ResponseInterceptor()
    })
  

    test.each([
        { actionResult: new NotFoundObjectResult(), expectedStatusCode: HttpStatus.NOT_FOUND},
        { actionResult: new InternalServerErrorObjectResult({message:'Internal Server Error'}), expectedStatusCode: HttpStatus.INTERNAL_SERVER_ERROR },
        { actionResult: new CreatedObjectResult({id:5050}), expectedStatusCode: HttpStatus.CREATED}
    ])
    ('intercept $actionResult should return status: $expectedStatusCode and body: $actionResult.body', async ({ actionResult, expectedStatusCode }) => {

        //Arrange
        const mockedResponse = new MockedResponse();
        const context = createMock<ExecutionContext>({
            switchToHttp: () => ({
                getResponse() {
                   return mockedResponse;
                },
            }),
        });

        const handler = createMock<CallHandler<IActionResult>>({
            handle: () => of(actionResult)
        });   
        const ctx = context.switchToHttp();
        const response: any = ctx.getResponse();

        //Act
        const observableResult = interceptor.intercept(context, handler);
        const result = await lastValueFrom(observableResult);

        //Assert
        expect(result).toBe(actionResult.body);
        expect(mockedResponse.statusCode).toBe(expectedStatusCode);
    })
})


class MockedResponse {
    statusCode: number;

    code(statusCode: number) {
        this.statusCode = statusCode
    };
}