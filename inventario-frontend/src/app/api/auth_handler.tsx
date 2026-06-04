const BASE = "http://localhost:8000";

export interface User { id: string; username: string; email: string; created_at: string; }
export interface Product { id: string; name: string; quantity: number; price: number; category: string; description: string; created_at: string; }
export interface ProductCreate { name: string; quantity: number; price: number; category?: string; description?: string; }
export interface Movement { id: string; product_id: string; product_name: string; movement_type: string; quantity: number; reason: string; created_at: string; }
export interface MovementCreate { product_id: string; movement_type: string; quantity: number; reason?: string; }

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  const res = await fetch(`${BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Error al registrar");
  return data.user;
}
export async function loginUser(username: string, password: string): Promise<User> {
  const res = await fetch(`${BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Error al iniciar sesion");
  return data.user;
}
export function getUser(): User | null { if (typeof window === "undefined") return null; const raw = localStorage.getItem("heladeria_user"); return raw ? JSON.parse(raw) : null; }
export function setUser(user: User): void { localStorage.setItem("heladeria_user", JSON.stringify(user)); }
export function removeUser(): void { localStorage.removeItem("heladeria_user"); }

export async function getProducts(): Promise<Product[]> { const res = await fetch(`${BASE}/products/`); const data = await res.json(); return Array.isArray(data) ? data : []; }
export async function createProduct(p: ProductCreate): Promise<Product> { const res = await fetch(`${BASE}/products/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }); const data = await res.json(); if (!res.ok) throw new Error(data.detail); return data; }
export async function deleteProduct(id: string): Promise<void> { await fetch(`${BASE}/products/${id}`, { method: "DELETE" }); }

export async function getMovements(): Promise<Movement[]> { const res = await fetch(`${BASE}/movements/`); const data = await res.json(); return Array.isArray(data) ? data : []; }
export async function createMovement(m: MovementCreate): Promise<Movement> { const res = await fetch(`${BASE}/movements/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(m) }); const data = await res.json(); if (!res.ok) throw new Error(data.detail); return data; }

export async function getStats() { const res = await fetch(`${BASE}/products/stats/summary`); return res.json(); }
export async function sendChatMessage(message: string): Promise<string> { const res = await fetch(`${BASE}/ai/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) }); const data = await res.json(); if (!res.ok) throw new Error(data.detail); return data.response; }
