"""
app.py - Punto de entrada del backend
Siguiendo el patrón del profe: Schemas → Models → Services → Routers → Server
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas.schemas import ProductCreate, ProductUpdate, MovementCreate
from models.models import ProductModel, MovementModel
from services.products import ProductService
from services.movements import MovementService
from routers.products import ProductRouter
from routers.movements import MovementRouter


def server(routers: dict) -> None:
    app = FastAPI(title="Inventario API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health():
        return {"status": "ok", "message": "Inventario API funcionando"}

    app.include_router(routers["products"].router)
    app.include_router(routers["movements"].router)

    return app


def main():
    # Siguiendo el patrón del profe:
    # Schemas → Models → Services → Routers → Server

    # Models (operaciones BD)
    product_model = ProductModel()
    movement_model = MovementModel()

    # Services (lógica de negocio)
    product_service = ProductService(product_model)
    movement_service = MovementService(movement_model)

    # Routers (endpoints HTTP)
    product_router = ProductRouter(product_service)
    movement_router = MovementRouter(movement_service)

    routers = {
        "products": product_router,
        "movements": movement_router,
    }

    return server(routers)


app = main()

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("🚀 Inventario Backend - FastAPI")
    print("=" * 50)
    print("Docs: http://127.0.0.1:8000/docs")
    print("=" * 50)
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
