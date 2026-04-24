"""
ProductRouter - Rutas HTTP para productos
Siguiendo exactamente el patrón TeacherRouter del profe
"""
from uuid import UUID
from fastapi import HTTPException

from routers.base import BaseRouter
from services.products import ProductService
from schemas.schemas import ProductCreate, ProductUpdate, ProductOut


class ProductRouter(BaseRouter):
    def __init__(self, service: ProductService):
        self._svc = service
        super().__init__(prefix="/products", tags=["products"])

    def _register_routes(self):
        self.router.add_api_route(
            "/",
            self.list_products,
            methods=["GET"],
            response_model=list[ProductOut],
        )
        self.router.add_api_route(
            "/",
            self.create_product,
            methods=["POST"],
            response_model=ProductOut,
            status_code=201,
        )
        self.router.add_api_route(
            "/{product_id}",
            self.get_product,
            methods=["GET"],
            response_model=ProductOut,
        )
        self.router.add_api_route(
            "/{product_id}",
            self.update_product,
            methods=["PATCH"],
            response_model=ProductOut,
        )
        self.router.add_api_route(
            "/{product_id}",
            self.delete_product,
            methods=["DELETE"],
            status_code=204,
        )

    async def list_products(self) -> list[ProductOut]:
        return await self._svc.get_all()

    async def create_product(self, body: ProductCreate) -> ProductOut:
        return await self._svc.create(body)

    async def get_product(self, product_id: UUID) -> ProductOut:
        product = await self._svc.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    async def update_product(self, product_id: UUID,
                              body: ProductUpdate) -> ProductOut:
        product = await self._svc.update(product_id, body)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    async def delete_product(self, product_id: UUID) -> None:
        deleted = await self._svc.delete(product_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Product not found")
