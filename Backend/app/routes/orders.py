from flask_restx import Namespace, Resource, fields
from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.cart_item import CartItem
from app.models.partition import Partition
from app.utils.security import token_required
from datetime import datetime

orders_ns = Namespace('orders', description="Commandes utilisateur")

order_model = orders_ns.model('Order', {
    'id': fields.Integer,
    'timestamp': fields.DateTime,
    'total_price': fields.Float,
    'items': fields.List(fields.Integer)  # liste des partition_id
})

@orders_ns.route('/')
class OrderList(Resource):
    @token_required
    @orders_ns.marshal_list_with(order_model)
    def get(self, user_id):
        """Liste les commandes passées par l'utilisateur"""
        orders = Order.query.filter_by(user_id=user_id).all()
        return [{
            "id": o.id,
            "timestamp": o.timestamp,
            "total_price": o.total_price,
            "items": [item.partition_id for item in o.items]
        } for o in orders]

    @token_required
    def post(self, user_id):
        """Valide une commande à partir du panier"""
        cart_items = CartItem.query.filter_by(user_id=user_id).all()
        if not cart_items:
            return {"message": "Panier vide"}, 400

        # Calcule le total
        total_price = 0
        order_items = []

        for item in cart_items:
            partition = Partition.query.get(item.partition_id)
            if not partition:
                continue
            total_price += partition.price
            order_items.append(OrderItem(partition_id=partition.id))

        # Crée la commande
        order = Order(user_id=user_id, total_price=total_price, timestamp=datetime.utcnow())
        db.session.add(order)
        db.session.flush()  # pour avoir l'ID de la commande

        for item in order_items:
            item.order_id = order.id
            db.session.add(item)

        # Vide le panier
        for item in cart_items:
            db.session.delete(item)

        db.session.commit()
        return {"message": "Commande validée", "order_id": order.id}, 201
