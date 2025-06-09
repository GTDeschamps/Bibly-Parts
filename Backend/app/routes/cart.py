from flask_restx import Namespace, Resource, fields
from app.extensions import db
from app.models.cart_item import CartItem
from app.models.partition import Partition
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

cart_ns = Namespace('cart', description="Gestion du panier utilisateur")

cart_item_model = cart_ns.model('CartItem', {
    'id': fields.Integer(readOnly=True),
    'partition_id': fields.Integer(required=True),
})

@cart_ns.route('/')
class CartList(Resource):
    @jwt_required()
    def get(self):
        """Liste les partitions dans le panier de l'utilisateur"""
        user_id = get_jwt_identity()
        cart_items = CartItem.query.filter_by(user_id=user_id).all()

        result = []
        for item in cart_items:
            partition = Partition.query.get(item.partition_id)
            if partition:
                result.append({
                    'cart_item_id': item.id,
                    'partition_id': partition.id,
                    'title': partition.title,
                    'artiste': getattr(partition, 'artiste', 'Inconnu'),
                    'instrument': getattr(partition, 'instrument', 'Non spécifié'),
                    'style': getattr(partition, 'style', 'Non spécifié'),
                    'type': getattr(partition, 'type', 'Non spécifié'),
                    'booklet': getattr(partition, 'booklet', 'N/A'),
                    'price': getattr(partition, 'price', 0),
                    'cover_image': getattr(partition, 'cover_image', None),
                })
        return result, 200

    @jwt_required()
    @cart_ns.expect(cart_item_model)
    def post(self):
        """Ajoute une partition au panier"""
        try:
            data = cart_ns.payload
            user_id = get_jwt_identity()
            partition_id = data['partition_id']

            # Vérifier si la partition existe
            partition = Partition.query.get(partition_id)
            if not partition:
                return {"message": "Partition non trouvée."}, 404

            # Vérifie si déjà dans le panier
            existing = CartItem.query.filter_by(user_id=user_id, partition_id=partition_id).first()
            if existing:
                return {"message": "Déjà dans le panier"}, 400

            item = CartItem(user_id=user_id, partition_id=partition_id)
            db.session.add(item)
            db.session.commit()

            return {"message": "Ajouté au panier"}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Erreur interne du serveur: {e}"}, 500

@cart_ns.route('/<int:partition_id>')
class CartItemDelete(Resource):
    @jwt_required()
    def delete(self, partition_id):
        """Supprime une partition du panier"""
        user_id = get_jwt_identity()
        item = CartItem.query.filter_by(user_id=user_id, partition_id=partition_id).first()
        if not item:
            return {"message": "Non trouvé dans le panier"}, 404
        db.session.delete(item)
        db.session.commit()
        return {"message": "Supprimé du panier"}, 204
