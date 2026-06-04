from fastapi import HTTPException
from routers.base import BaseRouter
from services.movements import MovementService
from schemas.schemas import MovementCreate

class MovementRouter(BaseRouter):
    def __init__(self, service: MovementService):
        super().__init__("/movements", ["movements"])
        self._svc = service
        self._setup()

    def _setup(self):
        @self.router.get("/")
        async def list_movements():
            return await self._svc.get_all()

        @self.router.post("/")
        async def create_movement(body: MovementCreate):
            try:
                return await self._svc.create(body)
            except ValueError as e:
                raise HTTPException(400, str(e))
