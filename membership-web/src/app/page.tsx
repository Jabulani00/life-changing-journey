import Link from "next/link";
import { FiCreditCard, FiLayers, FiShield, FiSmartphone, FiUserCheck } from "react-icons/fi";

const FEATURES = [
  { key: "priorityBooking",    label: "Priority Booking" },
  { key: "contentLibrary",     label: "Content Library" },
  { key: "weeklyTips",         label: "Weekly Tips" },
  { key: "privateCommunity",   label: "Private Community" },
  { key: "guidedMeditation",   label: "Guided Meditation" },
  { key: "prioritySupport",    label: "Priority Support" },
];

export default function Home() {
  return (
    <main className="container" style={{ padding: "2rem 0 3rem" }}>
      {/* Hero */}
      <section className="hero section">
        <div className="hero-chip">Life Changing Journey</div>
        <h2>Your membership, your transformation</h2>
        <p>
          Purchase and manage Silver, Gold, and Platinum memberships in one place.
          Benefits sync instantly to your mobile app — no manual steps.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/plans">
            <FiCreditCard />
            Explore packages
          </Link>
          <Link className="btn btn-outline" href="/dashboard">
            <FiUserCheck />
            My membership
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="grid grid-3 section">
        <article className="card">
          <span className="feature-icon"><FiShield size={18} /></span>
          <h3 style={{ margin: "0 0 0.4rem" }}>1) Sign in securely</h3>
          <p className="muted" style={{ margin: 0 }}>
            Firebase Auth with your email and password — the same account linked to your app.
          </p>
        </article>
        <article className="card">
          <span className="feature-icon"><FiLayers size={18} /></span>
          <h3 style={{ margin: "0 0 0.4rem" }}>2) Pick your plan</h3>
          <p className="muted" style={{ margin: 0 }}>
            Compare Silver, Gold, and Platinum packages with member-specific pricing for Children, Adults, or Couples.
          </p>
        </article>
        <article className="card">
          <span className="feature-icon"><FiUserCheck size={18} /></span>
          <h3 style={{ margin: "0 0 0.4rem" }}>3) Benefits go live</h3>
          <p className="muted" style={{ margin: 0 }}>
            Membership and entitlements are stored in Firestore — the app reads them automatically.
          </p>
        </article>
      </section>

      {/* Features strip */}
      <section className="card section">
        <h3 style={{ margin: "0 0 0.8rem", color: "var(--brand)" }}>Included entitlements</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.7rem",
                borderRadius: "0.65rem",
                background: "var(--background)",
                border: "1px solid var(--border)",
                fontSize: "0.83rem",
                fontWeight: 600,
              }}
            >
              <span className="dot dot-on" />
              {f.label}
            </div>
          ))}
        </div>
      </section>

      {/* Auto-sync banner */}
      <section className="callout-banner section">
        <div>
          <h3>Automatic mobile sync</h3>
          <p>
            After payment, open the Life Changing Journey app — features unlock automatically via Firestore
            real-time sync. No restart needed.
          </p>
        </div>
        <FiSmartphone size={40} style={{ opacity: 0.7, flexShrink: 0 }} />
      </section>
    </main>
  );
}
