from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.favorite import Favorite
from app.models.partition import Partition
from app.models.user import User  # Assure-toi que ce modèle existe

favorites_ns = Namespace('favorites', description="Gestion des favoris")

favorite_model = favorites_ns.model('Favorite', {
    'id': fields.Integer(readOnly=True),
    'partition_id': fields.Integer(required=True),
})

@favorites_ns.route('/')
class FavoriteList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"message": "Utilisateur non trouvé"}, 401

        favorites = Favorite.query.filter_by(user_id=user.id).all()
        result = []
        for fav in favorites:
            partition = Partition.query.get(fav.partition_id)
            if partition:
                result.append({
                    'favorite_id': fav.id,
                    'partition_id': partition.id,
                    'title': partition.title,
                    'artiste': getattr(partition, 'artiste', 'Inconnu'),
                    'instrument': getattr(partition, 'instrument', 'Non spécifié'),
                    'style': getattr(partition, 'style', 'Non spécifié'),
                    'type': getattr(partition, 'type', 'Non spécifié'),
                    'booklet': getattr(partition, 'booklet', 'N/A'),
                    'price': getattr(partition, 'price', 0),
                    'cover_image': getattr(partition, 'cover_image', None),
                    'audio_file': getattr(partition, 'audio_file', None),
                })
        return result, 200

    @jwt_required()
    @favorites_ns.expect(favorite_model)
    def post(self):
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return {"message": "Utilisateur non trouvé"}, 401

            data = favorites_ns.payload
            partition_id = data['partition_id']

            partition = Partition.query.get(partition_id)
            if not partition:
                return {"message": "Partition non trouvée."}, 404

            existing_fav = Favorite.query.filter_by(user_id=user.id, partition_id=partition_id).first()
            if existing_fav:
                return {"message": "Cette partition est déjà dans vos favoris."}, 409

            fav = Favorite(user_id=user.id, partition_id=partition_id)
            db.session.add(fav)
            db.session.commit()

            return {"message": "Ajouté aux favoris"}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Erreur interne du serveur: {e}"}, 500

@favorites_ns.route('/<int:partition_id>')
class FavoriteDelete(Resource):
    @jwt_required()
    def delete(self, partition_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"message": "Utilisateur non trouvé"}, 401

        fav = Favorite.query.filter_by(user_id=user.id, partition_id=partition_id).first()
        if not fav:
            return {"message": "Non trouvé"}, 404

        db.session.delete(fav)
        db.session.commit()
        return {"message": "Supprimé"}, 204
