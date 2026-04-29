"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MeResponse = { user: { id: string; email: string; isAdmin: boolean } | null };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function AppNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<MeResponse["user"] | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json() as Promise<MeResponse>)
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  return (
    <header className="nav">
      <div className="nav-logo">
        Life Changing <span>Journey</span>
      </div>

      <nav className="nav-tabs" aria-label="Primary tabs">
        {user ? (
          <>
            <Link className={`tab ${isActive(pathname, "/dashboard") ? "active" : ""}`} href="/dashboard">
              Dashboard
            </Link>
            <Link className={`tab ${isActive(pathname, "/plans") ? "active" : ""}`} href="/plans">
              Plans
            </Link>
            {user.isAdmin && (
              <Link className={`tab ${isActive(pathname, "/admin") ? "active" : ""}`} href="/admin">
                Admin
              </Link>
            )}
          </>
        ) : (
          <>
            <Link className={`tab ${isActive(pathname, "/") ? "active" : ""}`} href="/">
              Home
            </Link>
            <Link className={`tab ${isActive(pathname, "/plans") ? "active" : ""}`} href="/plans">
              Plans
            </Link>
            <Link className={`tab ${isActive(pathname, "/login") ? "active" : ""}`} href="/login">
              Sign in
            </Link>
          </>
        )}
      </nav>

      <div className="nav-actions">
        {user ? (
          <Link className="btn btn-primary" href="/plans">
            Upgrade
          </Link>
        ) : (
          <Link className="btn btn-primary" href="/login">
            Get started
          </Link>
        )}
      </div>
    </header>
  );
}
