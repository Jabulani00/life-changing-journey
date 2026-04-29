"use client";

import { FormEvent, useEffect, useState } from "react";
import type { MemberType, PlanId } from "@/lib/types";

type MembershipRow = {
  userId: string;
  planId: string;
  status: string;
  memberType: string;
  source?: string;
  startAt: string;
  endAt: string;
  email?: string | null;
  isExpired?: boolean;
};

type TransactionRow = {
  id: string;
  userId: string;
  planId: string;
  memberType: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  externalRef: string;
  createdAt: string;
};

type AdminData = {
  memberships: MembershipRow[];
  transactions: TransactionRow[];
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalTransactions: number;
    totalRevenue: number;
  };
};

type GrantForm = {
  userId: string;
  email: string;
  planId: PlanId;
  memberType: MemberType;
  durationMonths: number;
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmtDate(v?: string) {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtMoney(amount: number, currency = "ZAR") {
  return `${currency} ${amount.toFixed(2)}`;
}

function StatusBadge({ status, isExpired }: { status: string; isExpired?: boolean }) {
  if (isExpired || status === "expired") return <span className="badge badge-expired">Expired</span>;
  if (status === "active") return <span className="badge badge-active">Active</span>;
  if (status === "pending") return <span className="badge badge-pending">Pending</span>;
  if (status === "failed") return <span className="badge badge-failed">Failed</span>;
  return <span className="badge">{capitalize(status)}</span>;
}

function PlanBadge({ planId }: { planId: string }) {
  const cls = planId === "gold" ? "badge-gold" : planId === "platinum" ? "badge-platinum" : "badge-silver";
  return <span className={`badge ${cls}`}>{capitalize(planId)}</span>;
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<"memberships" | "transactions">("memberships");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<GrantForm>({
    userId: "",
    email: "",
    planId: "gold",
    memberType: "adults",
    durationMonths: 12,
  });
  const [grantStatus, setGrantStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [granting, setGranting] = useState(false);
  const [loadError, setLoadError] = useState("");

  async function loadData() {
    const res = await fetch("/api/admin/memberships");
    if (res.status === 403) {
      window.location.href = "/dashboard";
      return;
    }
    if (!res.ok) throw new Error("Failed to load admin data.");
    const d = (await res.json()) as AdminData;
    setData(d);
  }

  useEffect(() => {
    loadData().catch((e) => setLoadError(e instanceof Error ? e.message : "Load failed."));
  }, []);

  async function handleGrant(e: FormEvent) {
    e.preventDefault();
    setGrantStatus(null);
    setGranting(true);
    try {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Grant failed.");
      setGrantStatus({ type: "success", msg: "Membership granted successfully." });
      setShowModal(false);
      setForm({ userId: "", email: "", planId: "gold", memberType: "adults", durationMonths: 12 });
      await loadData();
    } catch (err) {
      setGrantStatus({ type: "error", msg: err instanceof Error ? err.message : "Grant failed." });
    } finally {
      setGranting(false);
    }
  }

  if (loadError) {
    return (
      <main className="container" style={{ padding: "28px 0" }}>
        <div className="alert alert-error">{loadError}</div>
      </main>
    );
  }

  const stats = data?.stats;

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <header className="topbar">
        <h1>Admin Panel</h1>
        <button className="btn btn-brand" onClick={() => { setGrantStatus(null); setShowModal(true); }}>
          + Grant Membership
        </button>
      </header>

      {grantStatus && (
        <div className={`alert ${grantStatus.type === "success" ? "alert-success" : "alert-error"}`}>
          {grantStatus.msg}
        </div>
      )}

      {/* Stat cards */}
      <section className="stats-row" style={{ marginBottom: "1.5rem" }}>
        <article className="stat-card">
          <div className="stat-label">Total Members</div>
          <div className="stat-val">{stats?.totalMembers ?? "—"}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Active Now</div>
          <div className="stat-val" style={{ color: "var(--green)" }}>
            {stats?.activeMembers ?? "—"}
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Transactions</div>
          <div className="stat-val">{stats?.totalTransactions ?? "—"}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Revenue (ZAR)</div>
          <div className="stat-val">
            {stats ? `R ${stats.totalRevenue.toFixed(2)}` : "—"}
          </div>
          <div className="stat-sub">Excl. manual grants</div>
        </article>
      </section>

      {/* Tab switcher */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${tab === "memberships" ? "active" : ""}`}
          onClick={() => setTab("memberships")}
        >
          Memberships
        </button>
        <button
          className={`admin-tab-btn ${tab === "transactions" ? "active" : ""}`}
          onClick={() => setTab("transactions")}
        >
          Transactions
        </button>
      </div>

      {/* Memberships table */}
      {tab === "memberships" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Type</th>
                <th>Status</th>
                <th>Source</th>
                <th>Started</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {(data?.memberships ?? []).map((m) => (
                <tr key={m.userId}>
                  <td style={{ fontSize: "0.8rem" }}>{m.email ?? m.userId}</td>
                  <td><PlanBadge planId={m.planId} /></td>
                  <td>{capitalize(m.memberType)}</td>
                  <td><StatusBadge status={m.status} isExpired={m.isExpired} /></td>
                  <td>
                    <span className={`badge ${m.source === "manual" ? "badge-manual" : "badge-web"}`}>
                      {m.source ?? "web"}
                    </span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDate(m.startAt)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDate(m.endAt)}</td>
                </tr>
              ))}
              {(data?.memberships ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>
                    No memberships yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Transactions table */}
      {tab === "transactions" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Plan</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {(data?.transactions ?? []).map((t) => (
                <tr key={t.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDate(t.createdAt)}</td>
                  <td><PlanBadge planId={t.planId} /></td>
                  <td>{capitalize(t.memberType)}</td>
                  <td>{t.gateway === "manual" ? <span className="muted">—</span> : fmtMoney(t.amount, t.currency)}</td>
                  <td><span className="badge">{t.gateway}</span></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td style={{ fontSize: "0.75rem", color: "var(--muted)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.externalRef}
                  </td>
                </tr>
              ))}
              {(data?.transactions ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grant Membership modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <h3>Grant Membership</h3>
            <form onSubmit={handleGrant}>
              <div className="field">
                <label>User ID</label>
                <input
                  type="text"
                  required
                  placeholder="Firebase UID"
                  value={form.userId}
                  onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Plan</label>
                <select
                  style={{ width: "100%", border: "1px solid #d6e3e8", borderRadius: "0.65rem", padding: "0.62rem 0.72rem", fontSize: "0.9rem" }}
                  value={form.planId}
                  onChange={(e) => setForm((f) => ({ ...f, planId: e.target.value as PlanId }))}
                >
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              <div className="field">
                <label>Member Type</label>
                <select
                  style={{ width: "100%", border: "1px solid #d6e3e8", borderRadius: "0.65rem", padding: "0.62rem 0.72rem", fontSize: "0.9rem" }}
                  value={form.memberType}
                  onChange={(e) => setForm((f) => ({ ...f, memberType: e.target.value as MemberType }))}
                >
                  <option value="children">Children</option>
                  <option value="adults">Adults</option>
                  <option value="couples">Couples</option>
                </select>
              </div>
              <div className="field">
                <label>Duration (months)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  required
                  value={form.durationMonths}
                  onChange={(e) => setForm((f) => ({ ...f, durationMonths: Number(e.target.value) }))}
                />
                <div className="field-hint">12 = 1 year · 120 = 10-year membership</div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button className="btn btn-brand" type="submit" disabled={granting} style={{ flex: 1 }}>
                  {granting ? "Granting..." : "Grant Membership"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  disabled={granting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
