import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base-repository';
import { NotificationTemplate, NotificationTemplateDocument } from './schema';

export class NotificationsTemplatesRepository extends BaseRepository<NotificationTemplateDocument> {
  constructor(
    @InjectModel(NotificationTemplate.name)
    protected model: Model<NotificationTemplateDocument>,
  ) {
    super(model);
  }
}
