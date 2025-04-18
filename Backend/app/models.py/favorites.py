from app import db

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    partition_id = db.Column(db.Integer, nullable=False)  # ID de la partition liée
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
