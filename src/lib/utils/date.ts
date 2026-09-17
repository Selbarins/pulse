/**
 * Timezone: Africa/Casablanca (GMT+1).
 * Daily reset at 00:00 local.
 */

export const TIMEZONE = "Africa/Casablanca";

export function todayInCasablanca(): string {
  // TODO: implement with proper TZ library or Intl
  return new Date().toISOString().slice(0, 10);
}
