"use client";

import { useState, useEffect } from "react";
import {
  getMovements,
  createMovement,
  Movement,
  MovementCreate,
} from "../api/movements_handler";
import { getProducts, Product } from "../api/products_handler";

interface FormErrors {
  product_id?: string;
  quantity?: string;
}

interface FormState {
  product_id: string;
  movement_type: "entrada" | "salida";
  quantity: string;
  reason: string;
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts]   = useState<Product[]>([]);
  const [form, setForm]           = useState<FormState>({
    product_id: "", movement_type: "entrada", quantity: "", reason: "",
  });
  const [errors, setErrors]       = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage]     = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  async function fetchMovements() {
    try {
      const data = await getMovements();
      setMovements(data);
    } catch {
      showMessage("Error al cargar movimientos", false);
    }
  }

  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {}
  }

  function showMessage(text: string, ok: boolean) {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 3000);
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.product_id)   e.product_id = "Selecciona un producto.";
    if (!form.quantity)     e.quantity   = "La cantidad es requerida.";
    else if (Number(form.quantity) <= 0) e.quantity = "Debe ser mayor a 0.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const body: MovementCreate = {
        product_id:    form.product_id,
        movement_type: form.movement_type,
        quantity:      Number(form.quantity),
        reason:        form.reason || undefined,
      };
      await createMovement(body);
      showMessage("Movimiento registrado exitosamente", true);
      setForm({ product_id: "", movement_type: "entrada", quantity: "", reason: "" });
      fetchMovements();
      fetchProducts();
    } catch {
      showMessage("Error al registrar movimiento", false);
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "ahora";
    if (diffMin < 60) return `hace ${diffMin}m`;
    if (diffHr < 24) return `hace ${diffHr}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
  }

  const entradas = movements.filter(m => m.movement_type === "entrada").length;
  const salidas = movements.filter(m => m.movement_type === "salida").length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--accent)" }}>
            Operaciones · 02
          </span>
          <span className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
          <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
            {movements.length} movimientos
          </span>
        </div>
        <h1
          className="text-5xl tracking-tight mb-2"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontWeight: 400,
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>Movimientos</span>
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}>.</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Registra entradas y salidas de tu inventario en tiempo real.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <StatMiniCard label="Total" value={movements.length.toString()} icon="◆" />
        <StatMiniCard label="Entradas" value={entradas.toString()} icon="↓" color="success" />
        <StatMiniCard label="Salidas" value={salidas.toString()} icon="↑" color="danger" />
      </div>

      {message && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-up"
          style={{
            background: message.ok ? "var(--success-bg)" : "var(--danger-bg)",
            color: message.ok ? "var(--success)" : "var(--danger)",
            border: `1px solid ${message.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          <span>{message.ok ? "✓" : "✕"}</span>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulario */}
        <div
          className="lg:col-span-2 rounded-xl p-6 h-fit animate-fade-up relative overflow-hidden"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            animationDelay: "160ms",
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -z-0"
            style={{
              background: form.movement_type === "entrada" ? "var(--success)" : "var(--danger)",
              transition: "background 0.3s",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>
                [↻]
              </span>
              <h2 className="text-lg font-semibold tracking-tight">Nuevo Movimiento</h2>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Toggle Entrada/Salida */}
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
                  Tipo de movimiento
                </label>
                <div
                  className="grid grid-cols-2 gap-1 p-1 rounded-lg"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  {(["entrada", "salida"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, movement_type: type }))}
                      className="py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all flex items-center justify-center gap-1.5"
                      style={{
                        background: form.movement_type === type
                          ? (type === "entrada" ? "var(--success-bg)" : "var(--danger-bg)")
                          : "transparent",
                        color: form.movement_type === type
                          ? (type === "entrada" ? "var(--success)" : "var(--danger)")
                          : "var(--text-tertiary)",
                      }}
                    >
                      <span>{type === "entrada" ? "↓" : "↑"}</span>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
                  Producto <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <select
                  name="product_id"
                  value={form.product_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg transition-colors"
                  style={{
                    background: "var(--bg-base)",
                    border: `1px solid ${errors.product_id ? "var(--danger)" : "var(--border-default)"}`,
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — stock: {p.quantity}
                    </option>
                  ))}
                </select>
                {errors.product_id && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--danger)" }}>
                    <span>⚠</span> {errors.product_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
                  Cantidad <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  className="w-full px-3 py-2 text-sm rounded-lg transition-colors font-mono"
                  style={{
                    background: "var(--bg-base)",
                    border: `1px solid ${errors.quantity ? "var(--danger)" : "var(--border-default)"}`,
                    color: "var(--text-primary)",
                  }}
                />
                {errors.quantity && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--danger)" }}>
                    <span>⚠</span> {errors.quantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
                  Razón
                </label>
                <input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Venta a cliente, restock..."
                  className="w-full px-3 py-2 text-sm rounded-lg transition-colors"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg-base)",
                  boxShadow: "0 0 24px var(--accent-glow)",
                }}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    Registrar Movimiento
                    <span className="font-mono text-xs opacity-70">↵</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Historial */}
        <div
          className="lg:col-span-3 rounded-xl overflow-hidden animate-fade-up"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            animationDelay: "240ms",
          }}
        >
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                [≡]
              </span>
              <h2 className="text-sm font-semibold">Historial</h2>
            </div>
            <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
              últimos 50
            </span>
          </div>

          {movements.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div
                className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center font-mono text-xl"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-tertiary)",
                  border: "1px dashed var(--border-default)",
                }}
              >
                ⇋
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                Sin movimientos
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Registra tu primer movimiento usando el formulario.
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="px-6 py-4 flex items-center gap-4 transition-colors"
                  style={{ borderTop: "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-elevated)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {/* Icono */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold flex-shrink-0"
                    style={{
                      background: m.movement_type === "entrada" ? "var(--success-bg)" : "var(--danger-bg)",
                      color: m.movement_type === "entrada" ? "var(--success)" : "var(--danger)",
                      border: `1px solid ${m.movement_type === "entrada" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    {m.movement_type === "entrada" ? "↓" : "↑"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                        {m.product_name}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold"
                        style={{
                          background: m.movement_type === "entrada" ? "var(--success-bg)" : "var(--danger-bg)",
                          color: m.movement_type === "entrada" ? "var(--success)" : "var(--danger)",
                        }}
                      >
                        {m.movement_type === "entrada" ? "+" : "-"}{m.quantity}
                      </span>
                    </div>
                    {m.reason && (
                      <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                        {m.reason}
                      </p>
                    )}
                  </div>

                  {/* Fecha */}
                  <div className="text-xs font-mono flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>
                    {formatDate(m.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatMiniCard({ label, value, icon, color }: {
  label: string; value: string; icon: string; color?: "success" | "danger";
}) {
  const iconColor = color === "success" ? "var(--success)" : color === "danger" ? "var(--danger)" : "var(--accent)";
  return (
    <div
      className="rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02]"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg"
        style={{
          background: "var(--bg-elevated)",
          color: iconColor,
          border: "1px solid var(--border-default)",
        }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </div>
        <div className="text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}
