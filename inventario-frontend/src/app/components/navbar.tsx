"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, removeUser, User } from "../api/auth_handler";

const links = [
  { href: "/products",  label: "Productos",   shortcut: "P" },
  { href: "/movements", label: "Movimientos", shortcut: "M" },
  { href: "/stats",     label: "Dashboard",   shortcut: "D" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { setUser(getUser()); }, [pathname]);

  function handleLogout() { removeUser(); router.push("/login"); }

  return (
    <header className="sticky top-0 z-50" style={{
      background: "rgba(253, 248, 243, 0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-subtle)",
      boxShadow: "0 1px 12px rgba(0,0,0,0.04)"
    }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/products" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 group-hover:rotate-6"
            style={{ background: "linear-gradient(135deg, #f4647a, #ff8fa3)", boxShadow: "0 4px 12px rgba(244,100,122,0.3)" }}>
            🍦
          </div>
          <div>
            <span className="font-serif text-lg leading-none" style={{ color: "var(--text-primary)" }}>
              heladería
            </span>
            <span className="font-mono text-xs ml-1" style={{ color: "var(--accent)" }}>/v1</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className="relative px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-2 transition-all"
                style={{
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  background: active ? "var(--accent-dim)" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}>
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "var(--accent)" }} />
                )}
                {link.label}
                <kbd className="hidden md:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded-lg"
                  style={{ background: "var(--bg-overlay)", color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)" }}>
                  {link.shortcut}
                </kbd>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "var(--success)" }} />
            <span className="font-mono">online</span>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #f4647a, #4ecdc4)" }}>
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-sm hidden md:block font-medium" style={{ color: "var(--text-secondary)" }}>
                {user.username}
              </span>
              <button onClick={handleLogout}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                style={{ color: "var(--text-tertiary)", border: "1px solid var(--border-default)", background: "var(--bg-surface)" }}>
                Salir
              </button>
            </div>
          ) : (
            <Link href="/login"
              className="text-sm px-4 py-2 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #f4647a, #ff8fa3)", boxShadow: "0 2px 8px rgba(244,100,122,0.3)" }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
