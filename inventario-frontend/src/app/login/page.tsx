"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, setUser } from "../api/auth_handler";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await loginUser(form.username, form.password);
      setUser(user); router.push("/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-base)" }}>
      {/* Decoración */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🍦</div>
      <div className="absolute bottom-20 right-10 text-5xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>🍨</div>
      <div className="absolute top-1/2 left-5 text-4xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>🍧</div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-card"
            style={{ background: "linear-gradient(135deg, #f4647a, #ff8fa3)" }}>
            🍦
          </div>
          <h1 className="font-serif text-3xl" style={{ color: "var(--text-primary)" }}>heladería</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Sistema de gestión de inventario</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-card" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Iniciar sesión</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid rgba(231,76,60,0.2)" }}>
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "username", label: "Usuario", type: "text", ph: "admin" },
              { key: "password", label: "Contraseña", type: "password", ph: "••••••" },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  {label}
                </label>
                <input type={type} value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph} required
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{ background: loading ? "#ccc" : "linear-gradient(135deg, #f4647a, #ff8fa3)", boxShadow: loading ? "none" : "0 4px 16px rgba(244,100,122,0.35)", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión →"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--text-tertiary)" }}>
            ¿No tienes cuenta?{" "}
            <Link href="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>Regístrate</Link>
          </p>

          <div className="mt-4 px-3 py-2 rounded-xl text-xs text-center font-mono" style={{ background: "var(--bg-base)", color: "var(--text-tertiary)" }}>
            Admin por defecto: <span style={{ color: "var(--accent)", fontWeight: 600 }}>admin</span> / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
