from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    sku: str
    price: str
    stock: int
    category: str
    status: str
    image: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    title: str
    message: str
    time: str
    type: str
    read: bool = False

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RevenueData(BaseModel):
    month: str
    revenue: float
    profit: float

class CategoryPerformance(BaseModel):
    name: str
    sales: float

class AnalyticsSummary(BaseModel):
    total_revenue: str
    net_profit: str
    items_sold: str
    avg_order_value: str

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str
    avatar: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class CompanyBase(BaseModel):
    name: str
    address: str
    tax_id: str
    phone: str
    email: str

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    tax_id: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class Company(CompanyBase):
    id: int

    class Config:
        from_attributes = True


