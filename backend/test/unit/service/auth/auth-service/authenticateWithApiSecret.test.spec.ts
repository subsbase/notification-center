import { UnauthorizedException } from '@nestjs/common';
import { RealmGlobalRepository } from '../../../../../src/repositories/realm/global-repository';
import { AccessTokenProcessor } from '../../../../../src/services/auth/access.token.processor';
import { AuthService } from '../../../../../src/services/auth/auth.service';
import { Realm } from '../../../../../src/repositories/realm/schema';
import { createMock } from '@golevelup/ts-jest';

describe('AuthService -  authenticateWithApiSecret ', () => {
  let realmRepository: RealmGlobalRepository;
  let accessTokenProcessor: AccessTokenProcessor;
  let authService: AuthService;

  beforeEach(async () => {
    realmRepository = createMock<RealmGlobalRepository>();
    accessTokenProcessor = createMock<AccessTokenProcessor>();
    authService = new AuthService(realmRepository, accessTokenProcessor);
  });

  it('should throw UnauthorizedException if realm is not found', async () => {
    jest.spyOn(realmRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(authService.authenticateWithApiSecret('invalidSecret')).rejects.toThrow(UnauthorizedException);
  });

  it('should return an access token if realm is found', async () => {
    const realm = {
      id: 'testRealm',
      secret: 'testSecret',
    } as Realm;
    const payload = {
      id: realm.id,
      name: realm.id,
      realm: realm.id,
      type: Realm.name,
    };
    const accessToken = 'testAccessToken';

    jest.spyOn(realmRepository, 'findOne').mockResolvedValueOnce(realm);
    jest.spyOn(accessTokenProcessor, 'generate').mockResolvedValueOnce(accessToken);

    const result = await authService.authenticateWithApiSecret(realm.secret);

    expect(realmRepository.findOne).toHaveBeenCalledWith({ secret: realm.secret });
    expect(accessTokenProcessor.generate).toHaveBeenCalledWith(payload);
    expect(result).toEqual(accessToken);
  });
});
