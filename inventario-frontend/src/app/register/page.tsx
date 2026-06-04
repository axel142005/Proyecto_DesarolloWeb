"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, setUser } from "../api/auth_handler";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      const user = await registerUser(form.username, form.email, form.password);
      setUser(user);
      router.push("/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-base)" }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍦</div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            heladería<span style={{ color: "var(--accent)" }}>/v1</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            Crea tu cuenta
          </p>
        </div>

        <div className="rounded-xl p-8" style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)"
        }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
            Crear cuenta
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2" style={{
              background: "var(--danger-bg)",
              color: "var(--danger)",
              border: "1px solid rgba(239,68,68,0.2)"
            }}>
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "username", label: "Usuario", type: "text", ph: "mi_usuario" },
              { key: "email", label: "Email", type: "email", ph: "correo@ejemplo.com" },
              { key: "password", label: "Contraseña", type: "password", ph: "••••••" },
              { key: "confirm", label: "Confirmar contraseña", type: "password", ph: "••••••" },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph}
                  required
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold mt-2"
              style={{
                background: loading ? "var(--bg-overlay)" : "var(--accent)",
                color: "var(--bg-base)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta →"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-tertiary)" }}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" style={{ color: "var(--accent)" }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
