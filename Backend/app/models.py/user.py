from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)

    favorites = db.relationship('Favorite', backref='user', lazy=True, cascade="all, delete-orphan")
    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade="all, delete-orphan")
    orders = db.relationship('Order', backref='user', lazy=True, cascade="all, delete-orphan")
