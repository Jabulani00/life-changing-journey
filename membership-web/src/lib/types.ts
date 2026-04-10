export type PlanId = "silver" | "gold" | "platinum";
export type MemberType = "children" | "adults" | "couples";
export type MembershipStatus = "active" | "pending" | "failed" | "expired";

export type Plan = {
  id: PlanId;
  name: string;
  prices: Record<MemberType, number>;
  currency: string;
  benefits: string[];
  order: number;
};

export type Membership = {
  id: string;
  userId: string;
  planId: PlanId;
  status: MembershipStatus;
  memberType: MemberType;
  startAt: string;
  endAt: string;
  source: "web";
  createdAt: string;
};

export type PaymentGateway = "mock" | "stripe";

export type Transaction = {
  id: string;
  userId: string;
  membershipId: string;
  planId: PlanId;
  memberType: MemberType;
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed";
  gateway: PaymentGateway;
  externalRef: string;
  createdAt: string;
};

export type Entitlements = {
  priorityBooking: boolean;
  contentLibrary: boolean;
  weeklyTips: boolean;
  privateCommunity: boolean;
  guidedMeditation: boolean;
  prioritySupport: boolean;
};
