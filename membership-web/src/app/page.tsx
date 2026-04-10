import Link from "next/link";
import { FiCreditCard, FiLayers, FiShield, FiUserCheck } from "react-icons/fi";

export default function Home() {
  return (
    <main className="container" style={{ padding: "2rem 0 3rem" }}>
      <header className="topbar">
        <h1>Membership Portal</h1>
        <nav aria-label="Primary">
          <Link className="btn btn-outline" href="/login">
            Login
          </Link>
          <Link className="btn btn-primary" href="/plans">
            View Plans
          </Link>
        </nav>
      </header>

      <section className="hero section">
        <span className="chip">Life Changing Journey</span>
        <h2 style={{ marginTop: "0.75rem", marginBottom: "0.25rem" }}>Choose the right membership package</h2>
        <p>
          Purchase and manage Silver, Gold, and Platinum memberships in one place. Membership status and
          entitlements sync to your account so the mobile app can unlock your benefits automatically.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/plans">
            <FiCreditCard />
            Explore packages
          </Link>
          <Link className="btn btn-outline" href="/dashboard">
            <FiUserCheck />
            View my membership
          </Link>
        </div>
      </section>

      <section className="grid grid-3 section">
        <article className="card">
          <span className="feature-icon">
            <FiShield size={18} />
          </span>
          <h3 style={{ marginBottom: "0.5rem" }}>1) Secure sign in</h3>
          <p className="muted">Use Firebase Auth with your email and password to access your account.</p>
        </article>
        <article className="card">
          <span className="feature-icon">
            <FiLayers size={18} />
          </span>
          <h3 style={{ marginBottom: "0.5rem" }}>2) Pick your plan</h3>
          <p className="muted">Compare Silver, Gold, and Platinum with member-specific pricing.</p>
        </article>
        <article className="card">
          <span className="feature-icon">
            <FiUserCheck size={18} />
          </span>
          <h3 style={{ marginBottom: "0.5rem" }}>3) Benefits activate</h3>
          <p className="muted">Your membership and entitlements are stored in Firestore for app access.</p>
        </article>
      </section>
      <p className="muted" style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Membership and transaction records are persisted to Firebase Firestore.
      </p>
    </main>
  );
}
