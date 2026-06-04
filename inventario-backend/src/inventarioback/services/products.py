from models.models import ProductModel
from schemas.schemas import ProductCreate, ProductUpdate

class ProductService:
    def __init__(self, model: ProductModel):
        self._model = model

    async def get_all(self) -> list:
        return self._model.get_all()

    async def get_by_id(self, product_id) -> dict:
        product = self._model.get_by_id(product_id)
        if not product:
            raise ValueError("Producto no encontrado")
        return product

    async def create(self, data: ProductCreate) -> dict:
        return self._model.create(data.name, data.quantity, data.price, data.category or "", data.description or "")

    async def update(self, product_id, data: ProductUpdate) -> dict:
        return self._model.update(product_id, data.name, data.quantity, data.price, data.category, data.description)

    async def delete(self, product_id) -> bool:
        return self._model.delete(product_id)

    async def get_stats(self) -> dict:
        return self._model.get_stats()
