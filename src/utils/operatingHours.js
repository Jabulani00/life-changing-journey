import { OPERATING_HOURS } from '../constants/planConfig'

/**
 * @param {Date} [now]
 * @returns {boolean} true if local time is within operating window (inclusive start, exclusive end by hour).
 */
export function isWithinOperatingHours(now = new Date()) {
  const h = now.getHours()
  return h >= OPERATING_HOURS.start && h < OPERATING_HOURS.end
}
