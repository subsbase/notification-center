import { Payload } from "../../types/global-types";

export class NotificationDto {
    to: Array<string>;
    payload: Payload;
    actionUrl: string
}