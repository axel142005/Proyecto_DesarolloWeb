"""
ProductService - Lógica de negocio para productos
Igual que TeacherService del profe
"""
from uuid import UUID
from typing import Optional

from models.models import ProductModel
from schemas.schemas import ProductCreate, ProductUpdate, ProductOut


class ProductService:
    def __init__(self, model: ProductModel):
        self._model = model

    async def get_all(self) -> list[dict]:
        return self._model.get_all()

    async def get_by_id(self, id: UUID) -> Optional[dict]:
        return self._model.get_by_id(id)

    async def create(self, data: ProductCreate) -> dict:
        return self._model.create(
            name=data.name,
            quantity=data.quantity,
            price=data.price,
            category=data.category or "",
            description=data.description or "",
        )

    async def update(self, id: UUID, data: ProductUpdate) -> Optional[dict]:
        return self._model.update(
            product_id=id,
            name=data.name,
            quantity=data.quantity,
            price=data.price,
            category=data.category,
            description=data.description,
        )

    async def delete(self, id: UUID) -> bool:
        return self._model.delete(id)
