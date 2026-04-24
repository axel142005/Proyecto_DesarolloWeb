const API = "http://127.0.0.1:8000";

export type Movement = {
  id: string;
  product_id: string;
  product_name: string;
  movement_type: "entrada" | "salida";
  quantity: number;
  reason: string | null;
  created_at: string;
};

export type MovementCreate = {
  product_id: string;
  movement_type: "entrada" | "salida";
  quantity: number;
  reason?: string;
};

export type Stats = {
  total_products: number;
  total_value: number;
  total_movements: number;
  low_stock_products: number;
};

export async function getMovements(): Promise<Movement[]> {
  const res = await fetch(`${API}/movements/`);
  return res.json();
}

export async function createMovement(body: MovementCreate): Promise<Movement> {
  const res = await fetch(`${API}/movements/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API}/movements/stats`);
  return res.json();
}
