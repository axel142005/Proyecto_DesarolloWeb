import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.models import ProductModel, MovementModel, UserModel
from services.products import ProductService
from services.movements import MovementService
from services.auth import AuthService
from services.ai_service import AIService
from routers.products import ProductRouter
from routers.movements import MovementRouter
from routers.auth import AuthRouter
from routers.ai_router import AIRouter

app = FastAPI(title="Heladeria API", version="2.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Wiring
product_model  = ProductModel()
movement_model = MovementModel()
user_model     = UserModel()

product_svc  = ProductService(product_model)
movement_svc = MovementService(movement_model)
auth_svc     = AuthService(user_model)
ai_svc       = AIService(product_model)

app.include_router(AuthRouter(auth_svc).router)
app.include_router(ProductRouter(product_svc).router)
app.include_router(MovementRouter(movement_svc).router)
app.include_router(AIRouter(ai_svc).router)

@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("🍦 Heladeria Backend - FastAPI v2")
    print("=" * 50)
    print("Docs: http://127.0.0.1:8000/docs")
    print("=" * 50)
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
