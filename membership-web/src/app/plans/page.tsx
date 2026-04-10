"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiCreditCard, FiGrid, FiHome } from "react-icons/fi";
import type { MemberType, Plan } from "@/lib/types";

const memberTypeLabels: Record<MemberType, string> = {
  children: "Children",
  adults: "Adults",
  couples: "Couples",
};

const tierDescriptions: Record<string, string> = {
  silver: "Essential support to begin your Life Changing Journey experience.",
  gold: "Enhanced membership with priority support and richer benefits.",
  platinum: "Complete premium experience for ongoing holistic transformation.",
};

type UserResponse = { user: { id: string; email: string } | null };
type PlansResponse = { plans: Plan[] };

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [memberType, setMemberType] = useState<MemberType>("adults");
  const [userEmail, setUserEmail] = useState("");
  const [statusText, setStatusText] = useState("");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [me, plansRes] = await Promise.all([fetch("/api/me"), fetch("/api/plans")]);
      const meData = (await me.json()) as UserResponse;
      if (!meData.user) {
        window.location.href = "/login";
        return;
      }
      setUserEmail(meData.user.email);

      const plansData = (await plansRes.json()) as PlansResponse;
      setPlans(plansData.plans);
    }
    load().catch(() => setStatusText("Unable to load plans right now."));
  }, []);

  const sortedPlans = useMemo(() => [...plans].sort((a, b) => a.order - b.order), [plans]);

  async function buyPlan(planId: string) {
    setStatusText("");
    setLoadingPlanId(planId);
    try {
      const response = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, memberType }),
      });
      const body = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
      if (!response.ok) throw new Error(body?.error ?? "Purchase failed");
      setStatusText(body?.message ?? "Membership updated.");
      window.location.href = "/dashboard";
    } catch (err) {
      setStatusText(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setLoadingPlanId(null);
    }
  }

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <header className="plans-header">
        <h2>Choose your membership</h2>
        <p>Signed in as {userEmail || "loading..."} · One-time payment packages.</p>
      </header>
      <header className="topbar" style={{ marginBottom: "1rem" }}>
        <div />
        <nav>
          <Link className="btn btn-outline" href="/dashboard">
            <FiGrid />
            Dashboard
          </Link>
          <Link className="btn btn-outline" href="/">
            <FiHome />
            Home
          </Link>
        </nav>
      </header>

      <section className="member-selector">
        {(["children", "adults", "couples"] as MemberType[]).map((type) => (
          <button
            key={type}
            className={`mem-btn ${memberType === type ? "active" : ""}`}
            onClick={() => setMemberType(type)}
          >
            {memberTypeLabels[type]}
          </button>
        ))}
      </section>
      <p className="muted" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
        Payment mode: mock placeholder ({process.env.NEXT_PUBLIC_PAYMENT_MODE ?? "mock"}).
      </p>

      <section className="plans-grid">
        {sortedPlans.map((plan) => (
          <article className={`card plan-card ${plan.id} ${plan.id === "gold" ? "featured" : ""}`} key={plan.id}>
            {plan.id === "gold" ? <div className="featured-badge">Most popular</div> : null}
            <div className="plan-tier">{plan.id}</div>
            <div className="plan-name">{plan.name}</div>
            <p className="plan-desc">{tierDescriptions[plan.id] ?? "Membership package"}</p>
            <div className="plan-price">
              <span className="price-currency">R</span>
              <span className="price">{plan.prices[memberType]}</span>
            </div>
            <div className="price-note">One-time payment · {memberTypeLabels[memberType]} plan</div>
            <hr className="plan-divider" />
            <div className="plan-benefits">
              {plan.benefits.map((benefit) => (
                <div className="benefit" key={benefit}>
                  <span className="benefit-dot" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <button
              className={`btn ${plan.id === "gold" ? "btn-primary" : "btn-outline"} plan-btn`}
              onClick={() => buyPlan(plan.id)}
              disabled={loadingPlanId === plan.id}
              style={{ width: "100%" }}
            >
              <FiCreditCard className="icon-inline" />
              {loadingPlanId === plan.id ? "Processing..." : `Purchase ${plan.name}`}
            </button>
          </article>
        ))}
      </section>

      {statusText ? (
        <p style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "0.65rem", background: "#f2f4f7" }}>
          {statusText}
        </p>
      ) : null}
    </main>
  );
}
