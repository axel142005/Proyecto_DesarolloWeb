"use client";

import { useState, useEffect } from "react";
import { getStats, Stats } from "../api/movements_handler";
import { getProducts, Product } from "../api/products_handler";

export default function StatsPage() {
  const [stats, setStats]         = useState<Stats | null>(null);
  const [products, setProducts]   = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [s, p] = await Promise.all([getStats(), getProducts()]);
      setStats(s);
      setProducts(p);
    } finally {
      setIsLoading(false);
    }
  }

  const lowStockProducts = products.filter(p => p.quantity < 10).sort((a, b) => a.quantity - b.quantity);
  const topValueProducts = [...products].sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity)).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--accent)" }}>
            Analytics · 03
          </span>
          <span className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
          <span className="font-mono text-xs flex items-center gap-2" style={{ color: "var(--text-tertiary)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "var(--success)" }} />
            en vivo
          </span>
        </div>
        <h1
          className="text-5xl tracking-tight mb-2"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontWeight: 400,
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>Dashboard</span>
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}>.</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Métricas y estadísticas de tu inventario.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="rounded-xl p-6 h-32 animate-pulse"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
            />
          ))}
        </div>
      ) : stats && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <BigStatCard
              label="Productos"
              value={stats.total_products}
              subtitle="registros activos"
              icon="◆"
              delay={80}
            />
            <BigStatCard
              label="Valor Total"
              value={`$${stats.total_value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
              subtitle="inventario valorizado"
              icon="$"
              accent
              delay={160}
            />
            <BigStatCard
              label="Movimientos"
              value={stats.total_movements}
              subtitle="operaciones totales"
              icon="≡"
              delay={240}
            />
            <BigStatCard
              label="Stock Bajo"
              value={stats.low_stock_products}
              subtitle="requieren atención"
              icon="⚠"
              warning={stats.low_stock_products > 0}
              delay={320}
            />
          </div>

          {/* Dos columnas: stock bajo y top valor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Stock Bajo */}
            <div
              className="rounded-xl overflow-hidden animate-fade-up"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                animationDelay: "400ms",
              }}
            >
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
                  >
                    ⚠
                  </span>
                  <h2 className="text-sm font-semibold">Stock Bajo</h2>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                  {lowStockProducts.length} productos
                </span>
              </div>
              <div>
                {lowStockProducts.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ background: "var(--success-bg)", color: "var(--success)" }}
                    >
                      ✓
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                      Todo en orden
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                      Ningún producto con stock bajo
                    </p>
                  </div>
                ) : (
                  lowStockProducts.slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      className="px-6 py-3 flex items-center gap-3"
                      style={{ borderTop: "1px solid var(--border-subtle)" }}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {p.name}
                        </div>
                        {p.category && (
                          <div className="text-xs font-mono mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                            {p.category}
                          </div>
                        )}
                      </div>
                      {/* Barra visual */}
                      <div className="w-24">
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: "var(--bg-base)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min((p.quantity / 10) * 100, 100)}%`,
                              background: p.quantity < 5 ? "var(--danger)" : "var(--warning)",
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="font-mono text-sm font-semibold w-8 text-right"
                        style={{
                          color: p.quantity < 5 ? "var(--danger)" : "var(--warning)",
                        }}
                      >
                        {p.quantity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Valor */}
            <div
              className="rounded-xl overflow-hidden animate-fade-up"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                animationDelay: "480ms",
              }}
            >
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                  >
                    ★
                  </span>
                  <h2 className="text-sm font-semibold">Top por Valor</h2>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                  top 5
                </span>
              </div>
              <div>
                {topValueProducts.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      Sin productos registrados
                    </p>
                  </div>
                ) : (
                  topValueProducts.map((p, i) => {
                    const value = p.price * p.quantity;
                    const maxValue = topValueProducts[0].price * topValueProducts[0].quantity;
                    const percent = (value / maxValue) * 100;
                    return (
                      <div
                        key={p.id}
                        className="px-6 py-3"
                        style={{ borderTop: "1px solid var(--border-subtle)" }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-xs w-5 h-5 rounded flex items-center justify-center"
                              style={{
                                background: "var(--bg-elevated)",
                                color: "var(--text-tertiary)",
                              }}
                            >
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {p.name}
                            </span>
                          </div>
                          <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>
                            ${value.toFixed(2)}
                          </span>
                        </div>
                        <div
                          className="h-1 rounded-full overflow-hidden"
                          style={{ background: "var(--bg-base)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percent}%`,
                              background: "linear-gradient(to right, var(--accent), rgba(163, 230, 53, 0.5))",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Info card al final */}
          <div
            className="rounded-xl p-6 animate-fade-up relative overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              animationDelay: "560ms",
            }}
          >
            <div className="grid-bg absolute inset-0 opacity-50" />
            <div className="relative z-10 flex items-center gap-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--accent), rgba(163, 230, 53, 0.5))",
                  color: "var(--bg-base)",
                }}
              >
                <span className="font-mono text-2xl font-bold">▲</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Sistema funcionando correctamente
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Tu inventario está siendo monitoreado en tiempo real.
                  Última actualización: ahora.
                </p>
              </div>
              <div className="flex items-center gap-2" style={{ color: "var(--success)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: "currentColor" }} />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                  operacional
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function BigStatCard({ label, value, subtitle, icon, accent, warning, delay }: {
  label: string;
  value: string | number;
  subtitle: string;
  icon: string;
  accent?: boolean;
  warning?: boolean;
  delay: number;
}) {
  const valueColor = warning
    ? "var(--warning)"
    : accent
    ? "var(--accent)"
    : "var(--text-primary)";

  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden group transition-all hover:scale-[1.02] animate-fade-up"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Glow decorativo */}
      {accent && (
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30"
          style={{ background: "var(--accent)" }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            {label}
          </span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm"
            style={{
              background: "var(--bg-elevated)",
              color: valueColor,
              border: "1px solid var(--border-default)",
            }}
          >
            {icon}
          </div>
        </div>
        <div
          className="text-3xl font-semibold tracking-tight mb-1"
          style={{ color: valueColor }}
        >
          {value}
        </div>
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
