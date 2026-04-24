const API = "http://127.0.0.1:8000";

export type Product = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string | null;
  description: string | null;
  created_at: string;
};

export type ProductCreate = {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  description?: string;
};

export type ProductUpdate = Partial<ProductCreate>;

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products/`);
  const data = await res.json();
  return data;
}

export async function createProduct(body: ProductCreate): Promise<Product> {
  const res = await fetch(`${API}/products/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateProduct(id: string, body: ProductUpdate): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  await fetch(`${API}/products/${id}`, { method: "DELETE" });
}
