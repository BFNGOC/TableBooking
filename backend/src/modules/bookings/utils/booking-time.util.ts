import { BadRequestException } from '@nestjs/common';

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new BadRequestException('Thời gian phải có định dạng HH:mm');
  }

  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

export function combineDateAndTime(bookingDate: Date, startTime: string): Date {
  const [hours, minutes] = startTime.split(':').map(Number);
  const dateTime = new Date(bookingDate);
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime;
}

export function combineBookingDateAndTime(
  bookingDate: Date,
  time: string,
): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(bookingDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}
