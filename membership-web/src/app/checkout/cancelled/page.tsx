import Link from "next/link";
import { FiAlertCircle, FiCreditCard, FiGrid } from "react-icons/fi";

export default function CheckoutCancelledPage() {
  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="checkout-result">
        <div className="checkout-result-icon cancelled">
          <FiAlertCircle size={36} />
        </div>

        <h2>Payment cancelled</h2>
        <p>
          No charge was made to your account. You can return to the plans page
          whenever you&apos;re ready to purchase a membership.
        </p>

        <div className="checkout-result-actions">
          <Link className="btn btn-primary" href="/plans">
            <FiCreditCard />
            Back to Plans
          </Link>
          <Link className="btn btn-outline" href="/dashboard">
            <FiGrid />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
