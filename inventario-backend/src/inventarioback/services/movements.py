"""
MovementService - Lógica de negocio para movimientos de inventario
Igual que TeacherService del profe
"""
from uuid import UUID

from models.models import MovementModel
from schemas.schemas import MovementCreate


class MovementService:
    def __init__(self, model: MovementModel):
        self._model = model

    async def get_all(self) -> list[dict]:
        return self._model.get_all()

    async def create(self, data: MovementCreate) -> dict:
        return self._model.create(
            product_id=data.product_id,
            movement_type=data.movement_type,
            quantity=data.quantity,
            reason=data.reason or "",
        )

    async def get_stats(self) -> dict:
        return self._model.get_stats()
