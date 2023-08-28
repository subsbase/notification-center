import { ArrayMinSize, IsArray, IsDate, IsNotEmpty } from 'class-validator';

export class SnoozedNotificationDto {
  @IsNotEmpty({ message: 'notification ids (to) must be specifed' })
  @IsArray({ message: 'notification ids (to) must be an array' })
  @ArrayMinSize(1, { message: 'notification ids (to) must contain at least one element' })
  notificationsIds: Array<string>;

  snoozeUntil: Date;
}
