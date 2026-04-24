"use client";

import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  Product,
  ProductCreate,
} from "../api/products_handler";

interface FormErrors {
  name?: string;
  quantity?: string;
  price?: string;
}

interface FormState {
  name: string;
  quantity: string;
  price: string;
  category: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [form, setForm]           = useState<FormState>({
    name: "", quantity: "", price: "", category: "", description: "",
  });
  const [errors, setErrors]       = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage]     = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      showMessage("Error al cargar productos", false);
    }
  }

  function showMessage(text: string, ok: boolean) {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 3000);
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim())       e.name     = "El nombre es requerido.";
    if (!form.quantity)          e.quantity = "La cantidad es requerida.";
    else if (Number(form.quantity) < 0) e.quantity = "La cantidad no puede ser negativa.";
    if (!form.price)             e.price    = "El precio es requerido.";
    else if (Number(form.price) < 0)    e.price    = "El precio no puede ser negativo.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const body: ProductCreate = {
        name:        form.name,
        quantity:    Number(form.quantity),
        price:       Number(form.price),
        category:    form.category || undefined,
        description: form.description || undefined,
      };
      await createProduct(body);
      showMessage("Producto creado exitosamente", true);
      setForm({ name: "", quantity: "", price: "", category: "", description: "" });
      fetchProducts();
    } catch {
      showMessage("Error al crear producto", false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      showMessage("Producto eliminado", true);
      fetchProducts();
    } catch {
      showMessage("Error al eliminar producto", false);
    }
  }

  // Calcular métricas
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = products.filter(p => p.quantity < 10).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--accent)" }}>
            Gestión · 01
          </span>
          <span className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
          <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
            {products.length} registros
          </span>
        </div>
        <h1
          className="text-5xl tracking-tight mb-2"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontWeight: 400,
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>Productos</span>
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}>.</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Administra tu catálogo y mantén control total del inventario.
        </p>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <StatCard label="Valor Total" value={`$${totalValue.toFixed(2)}`} accent />
        <StatCard label="Items en Stock" value={totalItems.toString()} />
        <StatCard label="Stock Bajo" value={lowStock.toString()} warning={lowStock > 0} />
      </div>

      {/* Mensaje feedback */}
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
          {/* Decoración */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 -z-0"
            style={{ background: "var(--accent)" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>
                [+]
              </span>
              <h2 className="text-lg font-semibold tracking-tight">Nuevo Producto</h2>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field
                label="Nombre"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Laptop Dell Inspiron"
                error={errors.name}
                required
              />

              <Field
                label="Categoría"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Electrónica"
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Cantidad"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  error={errors.quantity}
                  required
                />
                <Field
                  label="Precio"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  error={errors.price}
                  required
                  prefix="$"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detalles del producto..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg transition-colors resize-none"
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
                className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg-base)",
                  boxShadow: "0 0 24px var(--accent-glow)",
                }}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    Crear Producto
                    <span className="font-mono text-xs opacity-70">↵</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Tabla */}
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
                [◆]
              </span>
              <h2 className="text-sm font-semibold">Catálogo</h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                {products.length}
              </span>
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--bg-base)" }}>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-tertiary)" }}>Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-tertiary)" }}>Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-tertiary)" }}>Precio</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-tertiary)" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={p.id}
                      className="transition-colors"
                      style={{
                        borderTop: "1px solid var(--border-subtle)",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-elevated)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                            style={{
                              background: "var(--bg-elevated)",
                              color: "var(--accent)",
                              border: "1px solid var(--border-default)",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                              {p.name}
                            </div>
                            {p.category && (
                              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                                {p.category}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-semibold"
                          style={{
                            background: p.quantity < 10 ? "var(--danger-bg)" : "var(--accent-dim)",
                            color: p.quantity < 10 ? "var(--danger)" : "var(--accent)",
                          }}
                        >
                          <span className="w-1 h-1 rounded-full" style={{ background: "currentColor" }} />
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono" style={{ color: "var(--text-primary)" }}>
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs font-medium transition-colors px-2 py-1 rounded"
                          style={{ color: "var(--text-tertiary)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   Sub-componentes
   ════════════════════════════════ */

function StatCard({ label, value, accent, warning }: {
  label: string; value: string; accent?: boolean; warning?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden group transition-all hover:scale-[1.02]"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </div>
      <div
        className="text-2xl font-semibold tracking-tight"
        style={{
          color: warning ? "var(--warning)" : (accent ? "var(--accent)" : "var(--text-primary)"),
        }}
      >
        {value}
      </div>
      {accent && (
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--accent)" }}
        />
      )}
    </div>
  );
}

function Field({ label, error, prefix, required, ...props }: {
  label: string;
  error?: string;
  prefix?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
        {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono pointer-events-none"
            style={{ color: "var(--text-tertiary)" }}
          >
            {prefix}
          </span>
        )}
        <input
          {...props}
          className="w-full py-2 text-sm rounded-lg transition-colors"
          style={{
            background: "var(--bg-base)",
            border: `1px solid ${error ? "var(--danger)" : "var(--border-default)"}`,
            color: "var(--text-primary)",
            paddingLeft: prefix ? "2rem" : "0.75rem",
            paddingRight: "0.75rem",
          }}
        />
      </div>
      {error && (
        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--danger)" }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-20 text-center">
      <div
        className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center font-mono text-xl"
        style={{
          background: "var(--bg-elevated)",
          color: "var(--text-tertiary)",
          border: "1px dashed var(--border-default)",
        }}
      >
        ◯
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
        Sin productos registrados
      </p>
      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        Crea tu primer producto usando el formulario de la izquierda.
      </p>
    </div>
  );
}
