from fastapi import HTTPException
from routers.base import BaseRouter
from services.auth import AuthService
from schemas.schemas import UserRegister, UserLogin

class AuthRouter(BaseRouter):
    def __init__(self, service: AuthService):
        super().__init__("/auth", ["auth"])
        self._svc = service
        self._setup()

    def _setup(self):
        @self.router.post("/register")
        async def register(body: UserRegister):
            try:
                user = self._svc.register(body)
                return {"ok": True, "user": user}
            except ValueError as e:
                raise HTTPException(400, str(e))

        @self.router.post("/login")
        async def login(body: UserLogin):
            try:
                user = self._svc.login(body)
                return {"ok": True, "user": user}
            except ValueError as e:
                raise HTTPException(401, str(e))
