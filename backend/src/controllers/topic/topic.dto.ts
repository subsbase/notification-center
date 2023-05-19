import { IsNotEmpty, IsString } from 'class-validator';
import { NotificationTemplate } from '../../repositories/subject/topic/notification-template/schema';

export class TopicDto{
    @IsString()
    @IsNotEmpty()
    id: string;

    notificationTemplates?: Map<string, NotificationTemplate> 
}