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
    def get(self, user_id):
        """Liste les partitions dans le panier de l'utilisateur"""
        return CartItem.query.filter_by(user_id=user_id).all()

    @token_required
    @cart_ns.expect(cart_item_model)
    def post(self, user_id):
        """Ajoute une partition au panier"""
        data = cart_ns.payload
        # Vérifie si déjà dans le panier
        existing = CartItem.query.filter_by(user_id=user_id, partition_id=data['partition_id']).first()
        if existing:
            return {"message": "Déjà dans le panier"}, 400
        item = CartItem(user_id=user_id, partition_id=data['partition_id'])
