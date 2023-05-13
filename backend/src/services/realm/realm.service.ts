import { Injectable } from '@nestjs/common';
import { RealmGlobalRepository } from '../../repositories/realm/global-repository';
import { Realm } from '../../repositories/realm/schema';

@Injectable()
export class RealmService {
  constructor(private readonly realmRepository: RealmGlobalRepository) {}

  getRealm(name: string): Promise<Realm | null> {
    return this.realmRepository.findOne({ name: name });
  }
}
