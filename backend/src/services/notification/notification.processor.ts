import Handlebars from 'handlebars';
import { Payload } from '../../types/global-types';
import { Topic } from '../../repositories/topic/schema';
import { Notification } from '../../repositories/subscriber/notification/schema';

export class NotificationProcessor {
    
    build(topic: Topic, content: string, actionUrl: string): Notification {
        let notification = new Notification();
    
        notification.topic = topic;
        notification.actionUrl = actionUrl
        notification.content = content

        return notification;
    }

    compileContent(template: string | undefined, payload: Payload): string {
        return this.IsString(payload)? payload.toString() : Handlebars.compile(template)(payload);
    }

    private IsString(obj: any): boolean{
        return typeof obj === 'string' || obj instanceof String;
    }
}