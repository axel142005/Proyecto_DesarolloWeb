from models.models import UserModel
from schemas.schemas import UserRegister, UserLogin

class AuthService:
    def __init__(self, model: UserModel):
        self._model = model

    def register(self, data: UserRegister) -> dict:
        if self._model.get_by_username(data.username):
            raise ValueError("El nombre de usuario ya esta en uso")
        if self._model.get_by_email(data.email):
            raise ValueError("El email ya esta registrado")
        if len(data.password) < 6:
            raise ValueError("La contrasena debe tener al menos 6 caracteres")
        return self._model.create(data.username, data.email, data.password)

    def login(self, data: UserLogin) -> dict:
        user = self._model.verify_password(data.username, data.password)
        if not user:
            raise ValueError("Usuario o contrasena incorrectos")
        return user
