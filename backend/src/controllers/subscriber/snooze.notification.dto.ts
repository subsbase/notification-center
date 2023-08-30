import { UsePipes } from '@nestjs/common';
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class SnoozedNotificationDto {
  @IsNotEmpty({ message: 'must specify atleast one notification to be snoozed' })
  @IsArray({ message: 'notification ids must be an array' })
  @ArrayMinSize(1, { message: 'notification ids must contain at least one element' })
  notificationsIds: Array<string>;

  @IsDateString()
  snoozeUntil: Date;
}
