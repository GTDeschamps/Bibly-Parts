from flask_restx import Namespace, Resource, fields
from app.extensions import db
from app.models.user import User
from app.utils.security import hash_password, verify_password
from flask_jwt_extended import create_access_token

auth_ns = Namespace('auth', description="Opérations d'authentification")

user_model = auth_ns.model('UserRegister', {
    'username': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True),
})

login_model = auth_ns.model('UserLogin', {
    'email': fields.String(required=True),
    'password': fields.String(required=True),
})

@auth_ns.route('/register')
class Register(Resource):
    @auth_ns.expect(user_model)
    def post(self):
        data = auth_ns.payload
        if User.query.filter_by(email=data['email']).first():
            return {"message": "Email déjà utilisé"}, 400

        hashed = hash_password(data['password'])
        user = User(username=data['username'], email=data['email'], password_hash=hashed)
        db.session.add(user)
        db.session.commit()
        return {"message": "Utilisateur créé avec succès"}, 201


@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = auth_ns.payload
        user = User.query.filter_by(email=data['email']).first()
        if not user or not verify_password(data['password'], user.password_hash):
            return {"message": "Identifiants invalides"}, 401

        # ✅ Création d’un token JWT avec l'identité = user.id
        token = create_access_token(identity=user.id)

        return {
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "profile_image": user.profile_image
            }
        }, 200
