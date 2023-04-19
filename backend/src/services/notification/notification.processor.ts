import Handlebars from 'handlebars';
import { Payload } from '../../types/global-types';

export class NotificationProcessor {

    compileContent(template: string | undefined, payload: Payload): string {
        return this.IsString(payload)? payload.toString() : Handlebars.compile(template)(payload);
    }

    private IsString(obj: any): boolean{
        return typeof obj === 'string' || obj instanceof String;
    }
}