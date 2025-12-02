import { bookings, settings } from './data/index.js';
import { addSeconds, isBefore } from 'date-fns';

export function startBookingCleanupJob() {
  setInterval(() => {
    const now = new Date();
    const initialBookingsCount = bookings.length;

    for (let i = bookings.length - 1; i >= 0; i--) {
      const booking = bookings[i];
      // Only remove unpaid bookings
      if (!booking.isPaid) {
        const bookingExpirationTime = addSeconds(new Date(booking.bookedAt), settings.bookingPaymentTimeSeconds);
        if (isBefore(bookingExpirationTime, now)) {
          bookings.splice(i, 1);
          console.log(`Удалено неоплаченное бронирование: ${booking.id}`);
        }
      }
    }

    if (bookings.length < initialBookingsCount) {
      console.log(`Очистка завершена. Удалено ${initialBookingsCount - bookings.length} бронирований.`);
    }
  }, 1000); // Run every second
}