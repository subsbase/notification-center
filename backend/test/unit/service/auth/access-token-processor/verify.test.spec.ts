import { JwtService } from '@nestjs/jwt';
import { AccessTokenProcessor } from '../../../../../src/services/auth/access.token.processor';
import { createMock } from '@golevelup/ts-jest';
import { InvalidArgumentError } from '../../../../../src/types/exceptions';

describe('AccessTokenProcessor - verify', () => {
  let processor: AccessTokenProcessor;
  let jwtServiceMock: JwtService;

  beforeEach(async () => {
    jwtServiceMock = createMock<JwtService>();

    processor = new AccessTokenProcessor(jwtServiceMock);
  });

  it('should return decoded token if verification succeeded', async () => {
    // Arrange
    const token = 'valid_token';
    const decodedToken = { id: 'user_id' };
    jest.spyOn(jwtServiceMock, 'verifyAsync').mockResolvedValueOnce(decodedToken);

    // Act
    const result = await processor.verify(token);

    // Assert
    expect(result).toBe(decodedToken);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(token);
  });

  it('should throw error if verification failed', async () => {
    // Arrange
    const token = 'invalid_token';
    const error = new Error('Verification failed');
    jest.spyOn(jwtServiceMock, 'verifyAsync').mockRejectedValueOnce(error);

    // Act
    const verifyPromise = processor.verify(token);

    // Assert
    await expect(verifyPromise).rejects.toThrowError(error);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(token);
  });

  it('should throw error if token is empty', async () => {
    // Arrange
    const token = '';
    try {
      //Act
      await processor.verify(token);
    } catch (err) {
      // Assert
      expect(err).toBeInstanceOf(InvalidArgumentError);
    }
    expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
  });
});
