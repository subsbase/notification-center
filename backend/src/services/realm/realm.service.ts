import { Injectable } from "@nestjs/common";
import { RealmRepository } from "../../repositories/realm/repository";
import { Realm } from "../../repositories/realm/schema";

@Injectable()
export class RealmService {

    constructor(private readonly realmRepository: RealmRepository) {}

    getRealm(name: string) : Promise<Realm | null> {
        return this.realmRepository.findOne({ name: name })
    }
}