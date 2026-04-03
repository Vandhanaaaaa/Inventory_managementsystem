from . import crud, models, schemas, database

def seed():
    # Create tables
    models.Base.metadata.create_all(bind=database.engine)
    db = database.SessionLocal()
    try:
        # Initial Products
        if db.query(models.Product).count() == 0:
            print("Seeding products...")
            initial_products = [
                {"name": "Noise-Cancelling Headphones", "sku": "AUD-001", "price": "$299.00", "stock": 124, "category": "Electronics", "status": "Optimal", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"},
                {"name": "Mechanical Keyboard", "sku": "KEY-042", "price": "$149.00", "stock": 12, "category": "Accessories", "status": "Low Stock", "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80"},
                {"name": "Ergonomic Mouse", "sku": "MOU-099", "price": "$79.00", "stock": 0, "category": "Accessories", "status": "Out of Stock", "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"},
                {"name": "4K Monitor 27-inch", "sku": "MON-274", "price": "$399.00", "stock": 45, "category": "Displays", "status": "Optimal", "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"},
                {"name": "USB-C Hub", "sku": "HUB-112", "price": "$49.00", "stock": 230, "category": "Accessories", "status": "Optimal", "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"},
                {"name": "Laptop Stand", "sku": "STD-023", "price": "$35.00", "stock": 89, "category": "Accessories", "status": "Optimal", "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"},
                {"name": "Gaming Chair", "sku": "CHR-081", "price": "$249.00", "stock": 15, "category": "Furniture", "status": "Low Stock", "image": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80"},
                {"name": "Webcam 1080p", "sku": "CAM-055", "price": "$59.00", "stock": 150, "category": "Electronics", "status": "Optimal", "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"},
            ]
            for p in initial_products:
                crud.create_product(db, schemas.ProductCreate(**p))

        # Initial Alerts
        if db.query(models.Alert).count() == 0:
            print("Seeding alerts...")
            initial_alerts = [
                {"title": "Low Stock: Mechanical Keyboard", "message": "Inventory dropped below the reorder point of 20 units. Current stock: 12.", "time": "10 mins ago", "type": "warning", "read": False},
                {"title": "Critical: Ergonomic Mouse Out of Stock", "message": "Zero units available. Fulfillment for pending orders is paused.", "time": "1 hour ago", "type": "critical", "read": False},
                {"title": "Payment Gateway Successfully Updated", "message": "The Stripe integration was successfully updated to API v3.", "time": "3 hours ago", "type": "success", "read": True},
                {"title": "New Feature: AI Reorder Suggestions Available", "message": "Enable smart predictions in settings to automate your supply chain.", "time": "1 day ago", "type": "info", "read": True},
                {"title": "Shipping Delay: Regional Hub", "message": "Expect an average delay of 2 days for shipments routed through the East Coast hub.", "time": "2 days ago", "type": "warning", "read": True},
                {"title": "Database Backup Completed", "message": "Weekly full backup finished with zero errors.", "time": "3 days ago", "type": "success", "read": True},
            ]
            for a in initial_alerts:
                crud.create_alert(db, schemas.AlertCreate(**a))

        # Initial User
        if db.query(models.User).count() == 0:
            print("Seeding user...")
            initial_user = models.User(
                first_name="Alex",
                last_name="Morgan",
                email="alex.morgan@stocks.com",
                role="Administrator",
                avatar=None
            )
            db.add(initial_user)
            db.commit()

        # Initial Company
        if db.query(models.Company).count() == 0:
            print("Seeding company...")
            initial_company = models.Company(
                name="Stocks Global Inc.",
                address="123 Tech Avenue, Silicon Valley, CA 94025",
                tax_id="TX-987654321",
                phone="+1 (555) 123-4567",
                email="billing@stocksglobal.com"
            )
            db.add(initial_company)
            db.commit()


        print("Database seeding check complete.")

    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
