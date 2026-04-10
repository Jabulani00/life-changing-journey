/**
 * Life Changing Journey — membership packages (once-off fees, ZAR).
 * Kept aligned with membership-web/src/lib/plans.ts for consistency.
 */
export const MEMBERSHIP_PACKAGES = [
  {
    id: 'silver',
    name: 'Silver',
    accentColorKey: 'gray',
    prices: { children: 100, adults: 100, couples: 100 },
    benefits: [
      'Join our community/family',
      'Access to our services',
      'Get more information about us',
      'Be part of life changing journey',
      'Daily/weekly updates about what we do',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    accentColorKey: 'gold',
    prices: { children: 199, adults: 299, couples: 499 },
    benefits: [
      'Priority bookings',
      'Immediate response',
      'Discounts in bookings',
      'You join our community',
      'You get reminders of bookings',
      'Constant care and support',
      'Weekly motivation and mental health tips',
      'Progress tracking',
      'Monthly life coaching sessions',
      'Access to our content library',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    accentColorKey: 'platinum',
    prices: { children: 399, adults: 599, couples: 899 },
    benefits: [
      '24 hour services',
      'Quick bookings',
      'Immediate response',
      'More discounts in bookings',
      'Call reminders of bookings and guaranteed follow up/care',
      'Private community for continued support',
      'Monthly guided meditation sessions',
      'Private weekly progress sessions for wholistic intervention',
      'Access to all life changing journey business',
    ],
  },
]
