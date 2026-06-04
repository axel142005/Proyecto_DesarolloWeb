from fastapi import HTTPException
from uuid import UUID
from routers.base import BaseRouter
from services.products import ProductService
from schemas.schemas import ProductCreate, ProductUpdate

class ProductRouter(BaseRouter):
    def __init__(self, service: ProductService):
        super().__init__("/products", ["products"])
        self._svc = service
        self._setup()

    def _setup(self):
        @self.router.get("/")
        async def list_products():
            return await self._svc.get_all()

        @self.router.post("/")
        async def create_product(body: ProductCreate):
            try:
                return await self._svc.create(body)
            except ValueError as e:
                raise HTTPException(400, str(e))

        @self.router.get("/{product_id}")
        async def get_product(product_id: UUID):
            try:
                return await self._svc.get_by_id(product_id)
            except ValueError as e:
                raise HTTPException(404, str(e))

        @self.router.patch("/{product_id}")
        async def update_product(product_id: UUID, body: ProductUpdate):
            return await self._svc.update(product_id, body)

        @self.router.delete("/{product_id}")
        async def delete_product(product_id: UUID):
            await self._svc.delete(product_id)
            return {"ok": True}

        @self.router.get("/stats/summary")
        async def get_stats():
            return await self._svc.get_stats()
