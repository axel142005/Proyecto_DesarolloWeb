import os
from fastapi import HTTPException
from routers.base import BaseRouter
from services.ai_service import AIService
from schemas.schemas import ChatMessage

class AIRouter(BaseRouter):
    def __init__(self, service: AIService):
        super().__init__("/ai", ["ai"])
        self._svc = service
        self._setup()

    def _setup(self):
        @self.router.post("/chat")
        async def chat(body: ChatMessage):
            api_key = os.environ.get("ANTHROPIC_API_KEY", "")
            if not api_key or api_key == "tu_api_key_aqui":
                raise HTTPException(500, "Configura ANTHROPIC_API_KEY en el archivo .env")
            try:
                return {"response": self._svc.chat(body.message, api_key)}
            except ValueError as e:
                raise HTTPException(500, str(e))

        @self.router.get("/status")
        async def status():
            api_key = os.environ.get("ANTHROPIC_API_KEY", "")
            return {"ai_enabled": bool(api_key and api_key != "tu_api_key_aqui")}
