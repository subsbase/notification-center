import { createMock } from '@golevelup/ts-jest';
import { AuthManager } from '../../../../src/managers/auth/auth.manager';
import { AuthService } from '../../../../src/services/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthManager signIn', () => {
  it('should return an object containing an access_token when provided a valid apiSecret', async () => {
    const mockedAuthService = createMock<AuthService>();
    const authManager = new AuthManager(mockedAuthService);
    const apiSecret = 'valid_api_secret';
    const expectedAccessToken = 'valid_access_token';

    jest.spyOn(mockedAuthService, 'authenticateWithApiSecret').mockResolvedValue(expectedAccessToken);

    const result = await authManager.signIn(apiSecret);

    expect(result).toEqual({ access_token: expectedAccessToken });
  });

  it('should throw an error when provided an invalid apiSecret', async () => {
    const mockedAuthService = createMock<AuthService>();
    const authManager = new AuthManager(mockedAuthService);
    const apiSecret = 'invalid_api_secret';

    jest.spyOn(mockedAuthService, 'authenticateWithApiSecret').mockRejectedValue(new UnauthorizedException());

    await expect(authManager.signIn(apiSecret)).rejects.toThrow(UnauthorizedException);
  });
});
