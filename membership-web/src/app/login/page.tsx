"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FiArrowLeft, FiLock, FiMail, FiUserPlus } from "react-icons/fi";
import { firebaseAuth } from "@/lib/firebase-client-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = isSignupMode
        ? await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
        : await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);

      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Login failed");
      }
      router.push("/plans");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="login-wrap">
        <div className="login-logo">
          Life Changing <span>Journey</span>
        </div>
        <section className="login-card">
          <div className="login-title">{isSignupMode ? "Create your account" : "Welcome back"}</div>
          <div className="login-sub">
            {isSignupMode ? "Sign up to purchase and manage your membership" : "Sign in to manage your membership"}
          </div>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
              <div className="field-hint">
                <FiMail size={12} className="icon-inline" />
                Use the same email tied to your app account
              </div>
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
              <div className="field-hint">
                <FiLock size={12} className="icon-inline" />
                Minimum 6 characters
              </div>
            </div>
            {error ? (
              <p style={{ color: "#b42318", background: "#fef3f2", padding: "0.5rem", borderRadius: "0.5rem", marginBottom: "0.5rem" }}>
                {error}
              </p>
            ) : null}
            <button className="btn btn-primary login-btn" type="submit" disabled={loading}>
              {isSignupMode ? <FiUserPlus /> : <FiLock />}
              {loading ? "Please wait..." : isSignupMode ? "Create account" : "Sign in"}
            </button>
            <div className="login-divider">or</div>
            <button
              type="button"
              className="btn btn-outline toggle-link"
              onClick={() => setIsSignupMode((prev) => !prev)}
              disabled={loading}
            >
              {isSignupMode ? "Have an account? Sign in" : "New user? Create account"}
            </button>
            <div style={{ marginTop: "0.75rem" }}>
              <Link className="btn btn-outline" href="/" style={{ width: "100%" }}>
                <FiArrowLeft />
                Back
              </Link>
            </div>
          </form>
        </section>
        <div className="trust-row">
          <div className="trust-item">
            <span className="trust-icon">✓</span> Secure login
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span> Firebase auth
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span> Encrypted data
          </div>
        </div>
      </div>
    </main>
  );
}
