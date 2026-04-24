"""
MovementRouter - Rutas HTTP para movimientos de inventario
Siguiendo el patrón del profe
"""
from fastapi import HTTPException

from routers.base import BaseRouter
from services.movements import MovementService
from schemas.schemas import MovementCreate, MovementOut, StatsOut


class MovementRouter(BaseRouter):
    def __init__(self, service: MovementService):
        self._svc = service
        super().__init__(prefix="/movements", tags=["movements"])

    def _register_routes(self):
        self.router.add_api_route(
            "/",
            self.list_movements,
            methods=["GET"],
            response_model=list[MovementOut],
        )
        self.router.add_api_route(
            "/",
            self.create_movement,
            methods=["POST"],
            response_model=MovementOut,
            status_code=201,
        )
        self.router.add_api_route(
            "/stats",
            self.get_stats,
            methods=["GET"],
            response_model=StatsOut,
        )

    async def list_movements(self) -> list[MovementOut]:
        return await self._svc.get_all()

    async def create_movement(self, body: MovementCreate) -> MovementOut:
        if body.movement_type not in ["entrada", "salida"]:
            raise HTTPException(
                status_code=400,
                detail="movement_type debe ser 'entrada' o 'salida'"
            )
        try:
            return await self._svc.create(body)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def get_stats(self) -> StatsOut:
        return await self._svc.get_stats()
