import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalRepository } from '../base-global-repository';
import { ArchivedNotification, ArchivedNotificationDocument } from './schema';

@Injectable()
export class ArchivedNotificationsGlobalRepository extends GlobalRepository<ArchivedNotificationDocument, ArchivedNotification> {
    
    constructor(
    @InjectModel(ArchivedNotification.name)
    protected readonly model: Model<ArchivedNotificationDocument>) {
        super(model);
    }
}