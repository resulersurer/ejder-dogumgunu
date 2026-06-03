import { format, isSameDay, isSameMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Europe/Istanbul';

/**
 * Returns the current date in Turkey Timezone (Europe/Istanbul)
 */
export function getNowInTurkey() {
  return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Checks if the given birth date matches today's month and day in Turkey timezone.
 */
export function isBirthdayToday(birthDate: Date) {
  const today = getNowInTurkey();
  const bDay = toZonedTime(birthDate, TIMEZONE);
  
  return isSameMonth(today, bDay) && format(today, 'dd') === format(bDay, 'dd');
}

/**
 * Formats a date to a string suitable for display (e.g. DD.MM.YYYY)
 */
export function formatDate(date: Date) {
  const zonedDate = toZonedTime(date, TIMEZONE);
  return format(zonedDate, 'dd.MM.yyyy');
}
