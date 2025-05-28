from flask_restx import Namespace, Resource, fields
from app.extensions import db
from app.models.favorite import Favorite
from app.models.partition import Partition
from app.utils.security import token_required

favorites_ns = Namespace('favorites', description="Gestion des favoris")

favorite_model = favorites_ns.model('Favorite', {
    'id': fields.Integer(readOnly=True),
    'partition_id': fields.Integer(required=True),
})

@favorites_ns.route('/')
class FavoriteList(Resource):
    @token_required
    @favorites_ns.marshal_list_with(favorite_model)
    def get(self, user_id):
        """Liste les favoris d'un utilisateur"""
        return Favorite.query.filter_by(user_id=user_id).all()

    @token_required
    @favorites_ns.expect(favorite_model)
    def post(self, user_id):
        """Ajoute un favori"""
        data = favorites_ns.payload
        fav = Favorite(user_id=user_id, partition_id=data['partition_id'])
        db.session.add(fav)
        db.session.commit()
        return {"message": "Ajouté aux favoris"}, 201

@favorites_ns.route('/<int:partition_id>')
class FavoriteDelete(Resource):
    @token_required
    def delete(self, user_id, partition_id):
        """Supprime un favori"""
        fav = Favorite.query.filter_by(user_id=user_id, partition_id=partition_id).first()
        if not fav:
            return {"message": "Non trouvé"}, 404
        db.session.delete(fav)
        db.session.commit()
        return {"message": "Supprimé"}, 204
