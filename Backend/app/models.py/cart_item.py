from app import db

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    partition_id = db.Column(db.Integer, nullable=False)  # ID de la partition
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
