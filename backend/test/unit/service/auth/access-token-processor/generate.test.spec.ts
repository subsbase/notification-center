import { JwtService } from '@nestjs/jwt';
import { AccessTokenProcessor } from '../../../../../src/services/auth/access.token.processor';
import { createMock } from '@golevelup/ts-jest';

describe('AccessTokenProcessor - generate', () => {
  let jwtServiceMock: JwtService;
  let accessTokenProcessor: AccessTokenProcessor;

  beforeEach(() => {
    jwtServiceMock = createMock<JwtService>();
    accessTokenProcessor = new AccessTokenProcessor(jwtServiceMock);
  });

  it('should generate an access token with the given payload', async () => {
    const payload = { sub: 'user1' };
    const token = 'generated_token';
    jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValue(token);

    const result = await accessTokenProcessor.generate(payload);

    expect(result).toEqual(token);
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(payload);
  });

  it('should throw an error if jwtService throws an error while signing the token', async () => {
    const payload = { sub: 'user1' };
    const errorMessage = 'Error signing token';
    jest.spyOn(jwtServiceMock, 'signAsync').mockRejectedValue(new Error(errorMessage));

    await expect(accessTokenProcessor.generate(payload)).rejects.toThrowError(errorMessage);
  });

  it('should generate a different access token for different payloads', async () => {
    const payload1 = { sub: 'user1' };
    const payload2 = { sub: 'user2' };
    const token1 = 'generated_token_1';
    const token2 = 'generated_token_2';
    jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValueOnce(token1);
    jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValueOnce(token2);

    const result1 = await accessTokenProcessor.generate(payload1);
    const result2 = await accessTokenProcessor.generate(payload2);

    expect(result1).toEqual(token1);
    expect(result2).toEqual(token2);
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(payload1);
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(payload2);
    expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
    expect(result1).not.toEqual(result2);
  });
});
