import Handlebars from 'handlebars';
import { Payload } from '../../types/global-types';
import { Topic } from '../../repositories/topic/schema';
import { Notification } from '../../repositories/subscriber/notification/schema';
import { InvalidArgumentError } from '../../types/exceptions';
import { StringUtilts } from '../../utils/string-utils';

export class NotificationProcessor {
    
    build(topic: Topic, content: string, actionUrl: string): Notification {

        if(topic == null || topic == undefined){
            throw new InvalidArgumentError('topic')
        }

        if(this.isNotValidContent(content)){
            throw new InvalidArgumentError('content')
        }

        let notification = new Notification();
    
        notification.topic = topic;
        notification.actionUrl = actionUrl
        notification.content = content

        return notification;
    }

    compileContent(template: string | undefined, payload: Payload): string {
        return StringUtilts.isString(payload)? payload.toString() : Handlebars.compile(template)(payload);
    }

    isNotValidContent(content: string): boolean{
        return typeof content !== 'string' || StringUtilts.isEmptyOrWhiteSpace(content)
    }
}