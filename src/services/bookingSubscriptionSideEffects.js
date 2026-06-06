/**
 * Post-booking actions for subscription features (Firestore tasks; no push in-repo).
 */
import { createStaffTask } from './firebase'

/**
 * @param {{
 *   bookingId: string,
 *   userId: string,
 *   hasBookingReminders?: boolean,
 *   hasCallReminders?: boolean,
 *   hasGuaranteedFollowUp?: boolean,
 * }} opts
 */
export async function runBookingSubscriptionSideEffects(opts) {
  const { bookingId, userId } = opts
  if (!bookingId || !userId) return

  const tasks = []
  if (opts.hasCallReminders) {
    tasks.push(
      createStaffTask({
        bookingId,
        userId,
        type: 'call_reminder',
        payload: { note: 'Member has Platinum call-reminder benefit' },
      })
    )
  }
  if (opts.hasGuaranteedFollowUp) {
    tasks.push(
      createStaffTask({
        bookingId,
        userId,
        type: 'follow_up',
        payload: { note: 'Platinum guaranteed follow-up' },
      })
    )
  }
  if (opts.hasBookingReminders) {
    tasks.push(
      createStaffTask({
        bookingId,
        userId,
        type: 'booking_reminder',
        payload: { note: 'Send confirmation reminder (Gold+)' },
      })
    )
  }
  await Promise.all(tasks)
}
