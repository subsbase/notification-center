import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Payload } from '../../types/global-types';

export class NotificationDto {
  @IsNotEmpty({ message: 'subscribers ids (to) must be specifed' })
  @IsArray({ message: 'subscribers ids (to) must be an array' })
  @ArrayMinSize(1, { message: 'subscribers ids (to) must contain at least one element' })
  to: Array<string>;

  @IsNotEmpty()
  @IsString()
  actionUrl: string;
  
  title: string;
  message: string;

  templateId: string;
  payload: Payload;
}
