import type { Plan } from "@/lib/types";

const plans: Plan[] = [
  {
    id: "silver",
    name: "Silver",
    prices: { children: 100, adults: 100, couples: 100 },
    currency: "ZAR",
    benefits: [
      "Join our community/family",
      "Access to our services",
      "Get more information about us",
      "Be part of life changing journey",
      "Daily/weekly updates about what we do",
    ],
    order: 1,
  },
  {
    id: "gold",
    name: "Gold",
    prices: { children: 199, adults: 299, couples: 499 },
    currency: "ZAR",
    benefits: [
      "Priority bookings",
      "Immediate response",
      "Discounts in bookings",
      "You join our community",
      "You get reminders of bookings",
      "Constant care and support",
      "Weekly motivation and mental health tips",
      "Progress tracking",
      "Monthly life coaching sessions",
      "Access to our content library",
    ],
    order: 2,
  },
  {
    id: "platinum",
    name: "Platinum",
    prices: { children: 399, adults: 599, couples: 899 },
    currency: "ZAR",
    benefits: [
      "24 hour services",
      "Quick bookings",
      "Immediate response",
      "More discounts in bookings",
      "Call reminders of bookings and guaranteed follow up/care",
      "Private community for continued support",
      "Monthly guided meditation sessions",
      "Private weekly progress sessions for wholistic intervention",
      "Access to all life changing journey business",
    ],
    order: 3,
  },
];

export const PLANS: Plan[] = plans.sort((a, b) => a.order - b.order);

export function getPlan(planId: string) {
  return PLANS.find((plan) => plan.id === planId);
}
