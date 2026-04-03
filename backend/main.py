from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Smart Stock API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Products Endpoints ---

@app.get("/api/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

@app.post("/api/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@app.patch("/api/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = crud.update_product(db, product_id, product_update)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.delete("/api/products/{product_id}", response_model=schemas.Product)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.delete_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product



# --- Analytics Endpoints ---

@app.get("/api/analytics/summary", response_model=schemas.AnalyticsSummary)
def get_analytics_summary():
    # Mock data for now, can be calculated from products/orders later
    return {
        "total_revenue": "$340,000",
        "net_profit": "$96,000",
        "items_sold": "12,450",
        "avg_order_value": "$185.00"
    }

@app.get("/api/analytics/revenue", response_model=List[schemas.RevenueData])
def get_revenue_data():
    return [
        {"month": "Jan", "revenue": 45000, "profit": 12000},
        {"month": "Feb", "revenue": 52000, "profit": 15000},
        {"month": "Mar", "revenue": 48000, "profit": 11000},
        {"month": "Apr", "revenue": 61000, "profit": 18000},
        {"month": "May", "revenue": 59000, "profit": 16000},
        {"month": "Jun", "revenue": 75000, "profit": 24000},
    ]

@app.get("/api/analytics/categories", response_model=List[schemas.CategoryPerformance])
def get_category_performance():
    return [
        {"name": "Electronics", "sales": 12400},
        {"name": "Accessories", "sales": 8500},
        {"name": "Furniture", "sales": 5200},
        {"name": "Apparel", "sales": 3100},
    ]

# --- Alerts Endpoints ---

@app.get("/api/alerts", response_model=List[schemas.Alert])
def read_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_alerts(db, skip=skip, limit=limit)

@app.patch("/api/alerts/{alert_id}/read", response_model=schemas.Alert)
def mark_alert_as_read(alert_id: int, db: Session = Depends(get_db)):
    db_alert = crud.mark_alert_read(db, alert_id)
    if db_alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return db_alert

# --- User/Profile Endpoints ---

@app.get("/api/user/profile", response_model=schemas.User)
def read_user_profile(db: Session = Depends(get_db)):
    # Hardcoded ID 1 for demonstration
    user = crud.get_user(db, user_id=1)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.patch("/api/user/profile", response_model=schemas.User)
def update_user_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = crud.update_user(db, user_id=1, user_update=user_update)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Company Endpoints ---

@app.get("/api/company", response_model=schemas.Company)
def read_company(db: Session = Depends(get_db)):
    # Hardcoded ID 1 for demonstration
    company = crud.get_company(db, company_id=1)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@app.patch("/api/company", response_model=schemas.Company)
def update_company(company_update: schemas.CompanyUpdate, db: Session = Depends(get_db)):
    company = crud.update_company(db, company_id=1, company_update=company_update)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


