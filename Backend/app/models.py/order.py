from app import db
from datetime import datetime

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    partition_id = db.Column(db.Integer, nullable=False)  # ID de la partition achetée
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
