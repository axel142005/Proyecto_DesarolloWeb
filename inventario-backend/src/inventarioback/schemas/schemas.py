"""
Schemas - Estructura y validación de datos
Siguiendo el patrón del profe con Pydantic
"""
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


# ─────────────────────────────────────────
# PRODUCT SCHEMAS
# ─────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    quantity: int
    price: float
    category: Optional[str] = None
    description: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None


class ProductOut(ProductBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# MOVEMENT SCHEMAS
# ─────────────────────────────────────────

class MovementBase(BaseModel):
    product_id: UUID
    movement_type: str   # "entrada" o "salida"
    quantity: int
    reason: Optional[str] = None


class MovementCreate(MovementBase):
    pass


class MovementOut(MovementBase):
    id: UUID
    product_name: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# STATS SCHEMA
# ─────────────────────────────────────────

class StatsOut(BaseModel):
    total_products: int
    total_value: float
    total_movements: int
    low_stock_products: int
