import { randomBytes } from 'crypto';

type CheckInBookingLike = {
  checkInToken?: string;
  checkInCode?: string;
};

export function generateCheckInToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateCheckInCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let code = '';

  for (let i = 0; i < 4; i++) {
    code += chars[randomBytes(1)[0] % chars.length];
  }

  return `TBK-${code}`;
}

export function assignCheckInCredentials<T extends CheckInBookingLike>(
  booking: T,
): T {
  if (!booking.checkInToken) {
    booking.checkInToken = generateCheckInToken();
  }

  if (!booking.checkInCode) {
    booking.checkInCode = generateCheckInCode();
  }

  return booking;
}
