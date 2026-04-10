import type { Entitlements, PlanId } from "@/lib/types";

const EMPTY_ENTITLEMENTS: Entitlements = {
  priorityBooking: false,
  contentLibrary: false,
  weeklyTips: false,
  privateCommunity: false,
  guidedMeditation: false,
  prioritySupport: false,
};

export function mapPlanToEntitlements(planId?: PlanId): Entitlements {
  if (!planId) return EMPTY_ENTITLEMENTS;

  if (planId === "silver") {
    return { ...EMPTY_ENTITLEMENTS };
  }

  if (planId === "gold") {
    return {
      ...EMPTY_ENTITLEMENTS,
      priorityBooking: true,
      contentLibrary: true,
      weeklyTips: true,
    };
  }

  return {
    ...EMPTY_ENTITLEMENTS,
    priorityBooking: true,
    contentLibrary: true,
    weeklyTips: true,
    privateCommunity: true,
    guidedMeditation: true,
    prioritySupport: true,
  };
}
