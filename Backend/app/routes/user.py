from flask_restx import Namespace, Resource, fields
from app.extensions import db
from app.models.user import User
from app.utils.security import token_required, hash_password

# ✅ D'abord on crée le namespace
user_ns = Namespace('user', description="Gestion du profil utilisateur")

# ✅ Ensuite on définit les modèles
user_model = user_ns.model('User', {
    'id': fields.Integer(readOnly=True),
    'email': fields.String,
    'username': fields.String
})

user_update_model = user_ns.model('UserUpdate', {
    'email': fields.String,
    'username': fields.String,
    'password': fields.String(description="Nouveau mot de passe (optionnel)")
})

# ✅ Puis on déclare la route
@user_ns.route('/me')
class UserProfile(Resource):
    @token_required
    # @user_ns.marshal_with(user_model)
    def get(self, user):
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }, 200
        
    @token_required
    @user_ns.expect(user_update_model)
    def put(self, user):
        """Met à jour les infos de l'utilisateur connecté"""
        data = user_ns.payload

        if 'email' in data:
            user.email = data['email']
        if 'username' in data:
            user.username = data['username']
        if 'password' in data and data['password']:
            user.password_hash = hash_password(data['password'])

        db.session.commit()
        return {"message": "Profil mis à jour"}

    @token_required
    def delete(self, user):
        """Supprime le compte utilisateur"""
        db.session.delete(user)
        db.session.commit()
        return {"message": "Compte supprimé"}, 204
