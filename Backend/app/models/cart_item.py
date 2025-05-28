from app import db

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    partition_id = db.Column(db.Integer, db.ForeignKey('partition.id'), nullable=False)

    __table_args__ = (db.UniqueConstraint('user_id', 'partition_id', name='unique_cart_item'),)
