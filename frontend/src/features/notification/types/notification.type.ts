export type NotificationType = 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'SYSTEM' | 'GENERAL';

export type NotificationReferenceModel = 'Booking' | 'Payment' | 'Restaurant' | 'Review';

export interface INotification {
    _id: string;

    type: NotificationType;

    title: string;

    message: string;

    referenceId?: string;

    referenceModel?: NotificationReferenceModel;

    data?: Record<string, unknown>;

    isRead: boolean;

    readAt?: string;

    createdAt: string;

    updatedAt: string;
}
