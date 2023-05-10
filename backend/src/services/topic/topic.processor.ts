import { StringUtilts } from "../../utils/string-utils";
import { InvalidArgumentError } from "../../types/exceptions";

export class TopicProcessor {
    validateEvent(event: string): void{
        if(this.isNotValidTopicEvent(event)){
            throw new InvalidArgumentError('event', `Invalid topic event ${event} event must be provided in kebab-case`)
        }
    }

    getTopicNameFormEvent(event: string) : string {
        return StringUtilts.kebabToNormal(event);
    }

    private isNotValidTopicEvent(event: string): boolean{
        return !StringUtilts.isKebabCase(event);
    }
}