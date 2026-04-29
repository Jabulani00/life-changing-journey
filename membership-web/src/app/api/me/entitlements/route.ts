import { NextResponse } from "next/server";
import { mapPlanToEntitlements } from "@/lib/entitlements";
import { getSessionUser } from "@/lib/auth";
import { getMembership } from "@/lib/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const membership = await getMembership(user.id);
  const now = new Date();
  const isExpired =
    !membership ||
    membership.status !== "active" ||
    new Date(membership.endAt) < now;

  const activePlan = !isExpired ? membership!.planId : undefined;

  return NextResponse.json({
    userId: user.id,
    membership: membership ? { ...membership, isExpired } : null,
    entitlements: mapPlanToEntitlements(activePlan),
  });
}
