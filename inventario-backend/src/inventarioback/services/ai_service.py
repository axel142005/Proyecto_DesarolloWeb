import urllib.request, urllib.error, json, os
from models.models import ProductModel

class AIService:
    def __init__(self, product_model: ProductModel):
        self._product_model = product_model

    def _get_context(self) -> str:
        try:
            products = self._product_model.get_all_for_ai()
            stats = self._product_model.get_stats()
            lines = ["=== INVENTARIO DE LA HELADERIA ==="]
            lines.append(f"Total productos: {stats['total_products']}")
            lines.append(f"Valor total: ${stats['total_value']:.2f}")
            lines.append(f"Stock bajo: {stats['low_stock_products']}")
            for p in products:
                status = "BAJO" if p["quantity"] < 10 else "OK"
                lines.append(f"- {p['name']}: {p['quantity']} uds @ ${float(p['price']):.2f} [{status}]")
            return "\n".join(lines)
        except Exception as e:
            return f"Inventario no disponible: {e}"

    def chat(self, message: str, api_key: str) -> str:
        context = self._get_context()
        print(f"[AI] API Key primeros 20 chars: {api_key[:20]}")
        print(f"[AI] Contexto: {context[:100]}")

        payload = json.dumps({
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 500,
            "system": f"Eres asistente de heladeria. Responde en espanol brevemente.\n{context}",
            "messages": [{"role": "user", "content": message}]
        }).encode("utf-8")

        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01"
            },
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.loads(r.read())
                return data["content"][0]["text"]
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"[AI] HTTP Error {e.code}: {error_body}")
            raise ValueError(f"Error HTTP {e.code}: {error_body}")
        except Exception as e:
            print(f"[AI] Error general: {type(e).__name__}: {e}")
            raise ValueError(f"Error: {type(e).__name__}: {e}")