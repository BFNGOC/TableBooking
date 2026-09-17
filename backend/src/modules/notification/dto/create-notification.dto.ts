import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  NotificationReferenceModel,
  NotificationType,
} from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsMongoId()
  @IsOptional()
  referenceId?: string;

  @IsEnum(NotificationReferenceModel)
  @IsOptional()
  referenceModel?: NotificationReferenceModel;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
