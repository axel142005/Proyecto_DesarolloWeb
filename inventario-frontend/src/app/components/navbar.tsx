"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/products",  label: "Productos",   shortcut: "P" },
  { href: "/movements", label: "Movimientos", shortcut: "M" },
  { href: "/stats",     label: "Dashboard",   shortcut: "D" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(10, 10, 10, 0.8)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/products" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center font-mono text-sm font-bold transition-transform group-hover:scale-110"
            style={{
              background: "var(--accent)",
              color: "var(--bg-base)",
            }}
          >
🍦
          </div>
          <span className="font-mono text-sm tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>heladería</span>
            <span style={{ color: "var(--text-tertiary)" }}>/v1</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md flex items-center gap-2 group"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  background: active ? "var(--bg-elevated)" : "transparent",
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
                <span>{link.label}</span>
                <kbd
                  className="hidden md:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--bg-overlay)",
                    color: "var(--text-tertiary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {link.shortcut}
                </kbd>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: "var(--success)" }}
            />
            <span className="font-mono">online</span>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg, #a3e635 0%, #65a30d 100%)",
              color: "var(--bg-base)",
            }}
          >
            AX
          </div>
        </div>
      </div>
    </header>
  );
}
