from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: UUID
    username: str
    email: str
    created_at: datetime

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

class MovementBase(BaseModel):
    product_id: UUID
    movement_type: str
    quantity: int
    reason: Optional[str] = None

class MovementCreate(MovementBase):
    pass

class MovementOut(MovementBase):
    id: UUID
    product_name: str
    created_at: datetime

class StatsOut(BaseModel):
    total_products: int
    total_value: float
    total_movements: int
    low_stock_products: int

class ChatMessage(BaseModel):
    message: str
