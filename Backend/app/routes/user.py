from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.utils.security import hash_password

# ✅ Namespace
user_ns = Namespace('user', description="Gestion du profil utilisateur")

# ✅ Modèles avec profile_image ajouté
user_model = user_ns.model('User', {
    'id': fields.Integer(readOnly=True),
    'email': fields.String,
    'username': fields.String,
    'profile_image': fields.String  # 👈 Ajout
})

user_update_model = user_ns.model('UserUpdate', {
    'email': fields.String,
    'username': fields.String,
    'password': fields.String(description="Nouveau mot de passe (optionnel)"),
    'profile_image': fields.String(description="URL de l'image de profil (Cloudinary)")  # 👈 Ajout
})

# ✅ Route protégée avec JWT
@user_ns.route('/me')
class UserProfile(Resource):
    @jwt_required()
    @user_ns.marshal_with(user_model)
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"message": "Utilisateur introuvable"}, 404
        return user, 200  # 👈 Retourne directement l'objet via marshal_with

    @jwt_required()
    @user_ns.expect(user_update_model)
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"message": "Utilisateur introuvable"}, 404

        data = user_ns.payload

        if 'email' in data:
            user.email = data['email']
        if 'username' in data:
            user.username = data['username']
        if 'password' in data and data['password']:
            user.password_hash = hash_password(data['password'])
        if 'profile_image' in data:
            user.profile_image = data['profile_image']  # 👈 Mise à jour de l'image

        db.session.commit()
        return {"message": "Profil mis à jour"}, 200

    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"message": "Utilisateur introuvable"}, 404

        db.session.delete(user)
        db.session.commit()
        return {"message": "Compte supprimé"}, 204
