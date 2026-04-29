"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signOut } from "firebase/auth";
import { FiCalendar, FiClock, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import { firebaseAuth } from "@/lib/firebase-client-auth";
import { Suspense } from "react";

type EntitlementsResponse = {
  userId: string;
  membership?: {
    planId: string;
    status: string;
    memberType: string;
    startAt: string;
    endAt: string;
    isExpired?: boolean;
    source?: string;
  } | null;
  entitlements: Record<string, boolean>;
};

type MeResponse = { user: { email: string } | null };

const ENT_LABELS: Record<string, string> = {
  priorityBooking:  "Priority Booking",
  contentLibrary:   "Content Library",
  weeklyTips:       "Weekly Tips",
  privateCommunity: "Private Community",
  guidedMeditation: "Guided Meditation",
  prioritySupport:  "Priority Support",
};

function getTierClass(planId?: string) {
  if (planId === "gold") return "gold";
  if (planId === "platinum") return "platinum";
  return "silver";
}

function formatPlan(planId?: string) {
  if (!planId) return "No Plan";
  return planId.charAt(0).toUpperCase() + planId.slice(1);
}

function formatDate(value?: string) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });
}

function DashboardContent() {
  const params = useSearchParams();
  const checkoutParam = params.get("checkout");
  const [email, setEmail] = useState("");
  const [data, setData] = useState<EntitlementsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/me");
      const meData = (await meRes.json()) as MeResponse;
      if (!meData.user) {
        window.location.href = "/login";
        return;
      }
      setEmail(meData.user.email);

      const entRes = await fetch("/api/me/entitlements");
      if (!entRes.ok) throw new Error("Could not load entitlements.");
      setData((await entRes.json()) as EntitlementsResponse);
    }
    load().catch((err) => setError(err instanceof Error ? err.message : "Could not load data."));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut(firebaseAuth).catch(() => {});
    window.location.href = "/";
  }

  const membership = data?.membership;
  const isExpired = membership?.isExpired;
  const displayStatus = isExpired ? "EXPIRED" : (membership?.status ?? "inactive").toUpperCase();
  const enabledCount = Object.values(data?.entitlements ?? {}).filter(Boolean).length;
  const totalCount = Object.keys(data?.entitlements ?? {}).length;

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      {checkoutParam === "success" && (
        <div className="alert alert-success">
          Payment confirmed! Your membership is now active.
        </div>
      )}
      {checkoutParam === "cancelled" && (
        <div className="alert alert-warning">
          Payment was not completed. No charge was made.
        </div>
      )}

      <header className="welcome-bar">
        <div>
          <h2>Welcome back</h2>
          <p>
            {email
              ? `${email} · ${formatPlan(membership?.planId)} member`
              : "Loading profile..."}
          </p>
        </div>
        <nav>
          <Link className="btn btn-outline" href="/plans">
            <FiGrid />
            Manage Plan
          </Link>
          <button className="btn btn-outline" onClick={logout}>
            <FiLogOut />
            Logout
          </button>
        </nav>
      </header>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {/* Stats row */}
      <section className="stats-row">
        <article className="stat-card">
          <div className="stat-label">Plan</div>
          <div className="stat-val">{formatPlan(membership?.planId)}</div>
          <div className="stat-sub">Once-off payment</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Status</div>
          <div
            className="stat-val"
            style={{ color: isExpired ? "var(--muted)" : membership?.status === "active" ? "var(--green)" : undefined }}
          >
            {displayStatus}
          </div>
          <div className="stat-sub">Valid to {formatDate(membership?.endAt)}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Member Type</div>
          <div className="stat-val">{(membership?.memberType ?? "N/A").toString().toUpperCase()}</div>
          <div className="stat-sub">Account access scope</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Features</div>
          <div className="stat-val">{enabledCount}/{totalCount || 6}</div>
          <div className="stat-sub">Enabled entitlements</div>
        </article>
      </section>

      <section className="main-grid">
        <div>
          {membership ? (
            <div className={`membership-card ${getTierClass(membership.planId)}`}>
              <p style={{ margin: 0, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.88 }}>
                Life Changing Journey
              </p>
              <h3>{formatPlan(membership.planId)} Membership</h3>
              <div className="membership-meta">
                <span className="chip">{displayStatus}</span>
                <span className="chip">{membership.memberType.toUpperCase()}</span>
                <span className="chip">ONCE-OFF</span>
              </div>
              <div className="membership-row">
                <span className="label">Member</span>
                <span className="value">
                  <FiUser size={13} className="icon-inline" />
                  {email || "Loading..."}
                </span>
              </div>
              <div className="membership-row">
                <span className="label">Valid Until</span>
                <span className="value">
                  <FiCalendar size={13} className="icon-inline" />
                  {formatDate(membership.endAt)}
                </span>
              </div>
              <div className="membership-row">
                <span className="label">Source</span>
                <span className="value">
                  <FiClock size={13} className="icon-inline" />
                  {membership.source ?? "web"}
                </span>
              </div>
            </div>
          ) : (
            <section className="card">
              <h2 style={{ marginBottom: "0.6rem" }}>Current membership</h2>
              <p className="muted">No membership found yet. Go to plans to purchase one.</p>
              <Link className="btn btn-brand" href="/plans" style={{ marginTop: "0.75rem" }}>
                View Plans
              </Link>
            </section>
          )}

          <div className="bottom-section">
            <div className="activity-title">Recent activity</div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot" />
                <div>
                  <div className="activity-text">
                    <strong>Membership synced</strong> — Dashboard refreshed from Firestore
                  </div>
                  <div className="activity-time">Today</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: "var(--green)" }} />
                <div>
                  <div className="activity-text">
                    <strong>Entitlements loaded</strong> — Mobile features ready for account
                  </div>
                  <div className="activity-time">Current session</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: "var(--gold)" }} />
                <div>
                  <div className="activity-text">
                    <strong>Plan checked</strong> — Review and manage package anytime
                  </div>
                  <div className="activity-time">Current session</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entitlements sidebar */}
        <aside className="entitlements-card">
          <div className="ent-title">App entitlements</div>
          <div className="ent-list">
            {Object.entries(data?.entitlements ?? {}).map(([key, enabled]) => (
              <div key={key} className={`ent-item${enabled ? " ent-item-on" : ""}`}>
                <span className="ent-name">{ENT_LABELS[key] ?? key}</span>
                <span className="ent-status" style={{ color: enabled ? "var(--green)" : "var(--muted)" }}>
                  <span className={`dot ${enabled ? "dot-on" : "dot-off"}`} />
                  {enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
