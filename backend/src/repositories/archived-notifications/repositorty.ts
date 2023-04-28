import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base-repository';
import { ArchivedNotification, ArchivedNotificationDocument } from './schema';

@Injectable()
export class ArchivedNotificationsRepository extends BaseRepository<ArchivedNotificationDocument, ArchivedNotification> {
    
    constructor(
    @InjectModel(ArchivedNotification.name)
    protected readonly model: Model<ArchivedNotificationDocument>) {
        super(model);
    }
}