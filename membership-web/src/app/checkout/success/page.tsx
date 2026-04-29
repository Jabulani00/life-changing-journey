import Link from "next/link";
import { FiCheckCircle, FiGrid, FiSmartphone } from "react-icons/fi";

export default function CheckoutSuccessPage() {
  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="checkout-result">
        <div className="checkout-result-icon success">
          <FiCheckCircle size={36} />
        </div>

        <h2>Payment confirmed!</h2>
        <p>
          Your Life Changing Journey membership is now active. Your benefits are
          being synced to your mobile app automatically.
        </p>

        <div className="checkout-result-card">
          <h3>
            <FiSmartphone size={16} style={{ verticalAlign: "-2px", marginRight: "0.4rem" }} />
            Open the app to unlock your features
          </h3>
          <ol style={{ margin: "0", paddingLeft: "1.2rem", color: "var(--muted)", fontSize: "0.88rem", lineHeight: "1.8" }}>
            <li>Open the <strong>Life Changing Journey</strong> app on your device.</li>
            <li>Sign in with the same email you used here.</li>
            <li>Your membership features will activate automatically — no restart needed.</li>
          </ol>
        </div>

        <div className="checkout-result-actions">
          <Link className="btn btn-brand" href="/dashboard">
            <FiGrid />
            View Dashboard
          </Link>
          <Link className="btn btn-outline" href="/plans">
            View Plans
          </Link>
        </div>
      </div>
    </main>
  );
}
