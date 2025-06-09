from flask_restx import Namespace, Resource, fields
from app.extensions import db
from app.models.cart_item import CartItem
from app.models.partition import Partition
from app.utils.security import token_required

cart_ns = Namespace('cart', description="Gestion du panier utilisateur")

cart_item_model = cart_ns.model('CartItem', {
    'id': fields.Integer(readOnly=True),
    'partition_id': fields.Integer(required=True),
})

@cart_ns.route('/')
class CartList(Resource):
    @token_required
    @cart_ns.marshal_list_with(cart_item_model)
    def get(self, **kwargs):
        """Liste les partitions dans le panier de l'utilisateur"""
        user = kwargs['user']
        return CartItem.query.filter_by(user_id=user.id).all()

    @token_required
    @cart_ns.expect(cart_item_model)
    def post(self, **kwargs):
        """Ajoute une partition au panier"""
        try:
            data = cart_ns.payload
            user = kwargs['user']
            partition_id = data['partition_id']

            # Vérifier si la partition existe
            partition = Partition.query.get(partition_id)
            if not partition:
                return {"message": "Partition non trouvée."}, 404

            # Vérifie si déjà dans le panier
            existing = CartItem.query.filter_by(user_id=user.id, partition_id=partition_id).first()
            if existing:
                return {"message": "Déjà dans le panier"}, 400

            item = CartItem(user_id=user.id, partition_id=partition_id)
            db.session.add(item)
            db.session.commit()

            return {"message": "Ajouté au panier"}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Erreur interne du serveur: {e}"}, 500

@cart_ns.route('/<int:partition_id>')
class CartItemDelete(Resource):
    @token_required
    def delete(self, partition_id, **kwargs):
        """Supprime une partition du panier"""
        user = kwargs['user']
        item = CartItem.query.filter_by(user_id=user.id, partition_id=partition_id).first()
        if not item:
            return {"message": "Non trouvé dans le panier"}, 404
        db.session.delete(item)
        db.session.commit()
        return {"message": "Supprimé du panier"}, 204
