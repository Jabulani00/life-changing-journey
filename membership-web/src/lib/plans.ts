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
      "More information about us",
      "Daily/weekly updates",
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
      "Booking discounts",
      "Access to content library",
      "Weekly motivation and mental health tips",
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
      "Private community support",
      "Monthly guided meditation sessions",
      "Private weekly progress sessions",
    ],
    order: 3,
  },
];

export const PLANS: Plan[] = plans.sort((a, b) => a.order - b.order);

export function getPlan(planId: string) {
  return PLANS.find((plan) => plan.id === planId);
}
