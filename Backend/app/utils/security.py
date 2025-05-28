import bcrypt
import jwt
import datetime
from flask import request, jsonify
from functools import wraps

SECRET_KEY = "ton_secret_super_secure"  # Mieux : charger depuis .env

# Hasher un mot de passe
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Vérifier un mot de passe
def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Créer un token JWT
def create_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

# Décoder un token JWT
def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None  # Token expiré
    except jwt.InvalidTokenError:
        return None  # Token invalide

# Decorator pour protéger les routes
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Le token peut venir dans les headers Authorization : Bearer <token>
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        user_id = decode_token(token)
        if not user_id:
            return jsonify({"message": "Token is invalid or expired!"}), 401

        # On peut aussi passer user_id à la fonction protégée via kwargs
        return f(user_id, *args, **kwargs)

    return decorated
