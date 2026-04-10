"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { FiCalendar, FiClock, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import { firebaseAuth } from "@/lib/firebase-client-auth";

type EntitlementsResponse = {
  userId: string;
  membership?: {
    planId: string;
    status: string;
    memberType: string;
    startAt: string;
    endAt: string;
  } | null;
  entitlements: Record<string, boolean>;
};

type MeResponse = { user: { email: string } | null };

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

export default function DashboardPage() {
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
      if (!entRes.ok) {
        throw new Error("Could not load entitlements.");
      }
      const entData = (await entRes.json()) as EntitlementsResponse;
      setData(entData);
    }

    load().catch((err) => setError(err instanceof Error ? err.message : "Could not load data."));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut(firebaseAuth).catch(() => {});
    window.location.href = "/";
  }

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <header className="welcome-bar">
        <div>
          <h2>Welcome back</h2>
          <p>{email ? `${email} · ${formatPlan(data?.membership?.planId)} member` : "Loading profile..."}</p>
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

      {error ? (
        <p style={{ color: "#b42318", background: "#fef3f2", padding: "0.75rem", borderRadius: "0.65rem" }}>
          {error}
        </p>
      ) : null}

      <section className="stats-row">
        <article className="stat-card">
          <div className="stat-label">Plan</div>
          <div className="stat-val">{formatPlan(data?.membership?.planId)}</div>
          <div className="stat-sub">Once-off payment</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Status</div>
          <div className="stat-val">{(data?.membership?.status ?? "inactive").toUpperCase()}</div>
          <div className="stat-sub">Valid to {formatDate(data?.membership?.endAt)}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Member Type</div>
          <div className="stat-val">{(data?.membership?.memberType ?? "N/A").toString().toUpperCase()}</div>
          <div className="stat-sub">Account access scope</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Features</div>
          <div className="stat-val">
            {Object.values(data?.entitlements ?? {}).filter(Boolean).length}/{Object.keys(data?.entitlements ?? {}).length}
          </div>
          <div className="stat-sub">Enabled entitlements</div>
        </article>
      </section>

      <section className="main-grid">
        <div>
          {data?.membership ? (
            <div className={`membership-card ${getTierClass(data.membership.planId)}`}>
              <p style={{ margin: 0, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.88 }}>
                Life Changing Journey
              </p>
              <h3>{formatPlan(data.membership.planId)} Membership</h3>
              <div className="membership-meta">
                <span className="chip">{data.membership.status.toUpperCase()}</span>
                <span className="chip">{data.membership.memberType.toUpperCase()}</span>
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
                  {formatDate(data.membership.endAt)}
                </span>
              </div>
              <div className="membership-row">
                <span className="label">Payment Source</span>
                <span className="value">
                  <FiClock size={13} className="icon-inline" />
                  {(data.membership as { source?: string }).source ?? "web"}
                </span>
              </div>
            </div>
          ) : (
            <section className="card">
              <h2 style={{ marginBottom: "0.6rem" }}>Current membership</h2>
              <p className="muted">No membership found yet. Go to plans to purchase one.</p>
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
                <div className="activity-dot" style={{ background: "var(--accent)" }} />
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

        <aside className="entitlements-card">
          <div className="ent-title">App entitlements</div>
          <div className="ent-list">
            {Object.entries(data?.entitlements ?? {}).map(([key, enabled]) => (
              <div key={key} className="ent-item">
                <span className="ent-name">{key}</span>
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
