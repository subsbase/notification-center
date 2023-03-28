import Handlebars from 'handlebars';

export class NotificationProcessor {

    compileContent(template: string, payload: any): string {
        return Handlebars.compile(template)(payload);
    }
}