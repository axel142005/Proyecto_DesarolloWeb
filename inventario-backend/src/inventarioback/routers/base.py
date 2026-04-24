"""
BaseRouter - Clase base para todos los routers
Siguiendo el patrón del profe con _register_routes
"""
from fastapi import APIRouter


class BaseRouter:
    def __init__(self, prefix: str, tags: list[str]):
        self.router = APIRouter(prefix=prefix, tags=tags)
        self._register_routes()

    def _register_routes(self):
        raise NotImplementedError
