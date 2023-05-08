import { JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';
import { AccessTokenProcessor } from '../../../../../src/services/auth/access.token.processor';

describe('AccessTokenProcessor - decode', () => {
  let accessTokenProcessor: AccessTokenProcessor;
  let jwtServiceMock: JwtService;

  beforeEach(() => {
    jwtServiceMock = createMock<JwtService>();
    accessTokenProcessor = new AccessTokenProcessor(jwtServiceMock);
  });

  it('should decode the given access token', () => {
    const payload = { sub: '123' };
    const encoded = 'encoded_access_token';
    const decoded = { sub: '123' };
    jest.spyOn(jwtServiceMock, 'decode').mockReturnValue(decoded);

    const result = accessTokenProcessor.decode(encoded);

    expect(result).toEqual(decoded);
    expect(jwtServiceMock.decode).toHaveBeenCalledWith(encoded);
  });

  it('should return null if the access token is invalid', () => {
    const encoded = 'invalid_access_token';
    jest.spyOn(jwtServiceMock, 'decode').mockReturnValue(null);

    const result = accessTokenProcessor.decode(encoded);

    expect(result).toBeNull();
    expect(jwtServiceMock.decode).toHaveBeenCalledWith(encoded);
  });
});
