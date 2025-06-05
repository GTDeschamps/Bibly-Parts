import bcrypt
import jwt
import datetime
from flask import request
from functools import wraps

from app.models.user import User  # ✅ Assure-toi que le chemin est correct

# 🔐 Clé secrète à sécuriser en prod via un .env
SECRET_KEY = "Admin"

# ✅ Hachage d'un mot de passe


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

# ✅ Vérification d'un mot de passe


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

# ✅ Création d'un token JWT


def create_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

# ✅ Décodage du token JWT


def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print("Payload décodé :", payload)
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# ✅ Décorateur pour protéger les routes avec injection de l'objet `User`


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Extraction du token depuis le header Authorization
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return ({"message": "Token manquant"}), 401

        user_id = decode_token(token)
        if not user_id:
            return ({"message": "Token invalide ou expiré"}), 401

        # Récupération de l'objet User
        user = User.query.get(user_id)
        if user:
            print("Utilisateur email:", user.email)
        else:
            print("Utilisateur introuvable")
        if not user:
            return ({"message": "Utilisateur introuvable"}), 404

# Injecte 'user' dans kwargs proprement
        kwargs['user'] = user
        return f(*args, **kwargs)

    return decorated
