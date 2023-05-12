import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RealmGlobalRepository } from '../../repositories/realm/global-repository';
import { AccessTokenProcessor } from './access.token.processor';
import { Realm } from '../../repositories/realm/schema';

@Injectable()
export class AuthService {

  constructor(
    private readonly realmRepository: RealmGlobalRepository,
    private readonly accessTokenProcessor: AccessTokenProcessor) {}

  async authenticateWithApiSecret(apiSecret: string) : Promise<string>{

    const realm = await this.realmRepository.findOne({ secret: apiSecret })

    if(!realm){
      throw new UnauthorizedException()
    }

    const payload = {
      id: realm.id,
      name: realm.id,
      realm: realm.id,
      type: Realm.name
    }

    return await this.accessTokenProcessor.generate(payload)
  }
}