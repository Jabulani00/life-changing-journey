"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname.startsWith("/dashboard");
  if (href === "/plans") return pathname.startsWith("/plans");
  if (href === "/login") return pathname.startsWith("/login");
  return pathname === href;
}

export default function AppNav() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="nav-logo">
        Life Changing <span>Journey</span>
      </div>
      <nav className="nav-tabs" aria-label="Primary tabs">
        <Link className={`tab ${isActive(pathname, "/dashboard") ? "active" : ""}`} href="/dashboard">
          Dashboard
        </Link>
        <Link className={`tab ${isActive(pathname, "/plans") ? "active" : ""}`} href="/plans">
          Plans
        </Link>
        <Link className={`tab ${isActive(pathname, "/login") ? "active" : ""}`} href="/login">
          Login
        </Link>
      </nav>
      <div className="nav-actions">
        <Link className="btn" href="/dashboard">
          Settings
        </Link>
        <Link className="btn btn-primary" href="/plans">
          Upgrade
        </Link>
      </div>
    </header>
  );
}
