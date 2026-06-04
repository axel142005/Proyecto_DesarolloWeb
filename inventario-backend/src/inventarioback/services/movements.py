from models.models import MovementModel
from schemas.schemas import MovementCreate

class MovementService:
    def __init__(self, model: MovementModel):
        self._model = model

    async def get_all(self) -> list:
        return self._model.get_all()

    async def create(self, data: MovementCreate) -> dict:
        return self._model.create(data.product_id, data.movement_type, data.quantity, data.reason or "")
