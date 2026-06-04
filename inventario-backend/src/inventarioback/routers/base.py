from fastapi import APIRouter

class BaseRouter:
    def __init__(self, prefix: str, tags: list = []):
        self.router = APIRouter(prefix=prefix, tags=tags)

    def register(self):
        pass
