import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Payload } from '../../types/global-types';
import { NotificationTemplateDto } from './notification.template.dto';

export class NotificationDto {
  @IsNotEmpty({ message: 'subscribers ids (to) must be specifed' })
  @IsArray({ message: 'subscribers ids (to) must be an array' })
  @ArrayMinSize(1, { message: 'subscribers ids (to) must contain at least one element' })
  to: Array<string>;

  @IsNotEmpty()
  payload: Payload;

  @IsNotEmpty()
  @IsString()
  actionUrl: string;

  notificationTemplate: NotificationTemplateDto;
}
