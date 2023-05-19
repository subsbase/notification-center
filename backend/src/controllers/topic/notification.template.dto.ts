import { IsNotEmpty, IsString } from "class-validator";

export class NotificationTemplateDto {

    @IsString()
    @IsNotEmpty()
    templateId: string;

    @IsString()
    @IsNotEmpty()
    titleTemplate:string;

    @IsString()
    @IsNotEmpty()
    messageTemplate: string;
}