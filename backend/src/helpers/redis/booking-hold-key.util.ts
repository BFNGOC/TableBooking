export function getBookingHoldKey(
  restaurantId: string,
  tableId: string,
  bookingDate: Date,
  startTime: string,
  endTime: string,
) {
  const date = bookingDate.toISOString().split('T')[0];

  return `booking:hold:${restaurantId}:${tableId}:${date}:${startTime}-${endTime}`;
}
