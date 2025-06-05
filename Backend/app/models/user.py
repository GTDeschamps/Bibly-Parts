from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    favorites = db.relationship('Favorite', backref='user', lazy=True, cascade="all, delete-orphan")
    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade="all, delete-orphan")
    orders = db.relationship('Order', backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.id}, {self.email}, {self.username}>"
