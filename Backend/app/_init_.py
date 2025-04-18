from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from .user import User
from .favorite import Favorite
from .cart_item import CartItem
from .order import Order


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object('config.Config')

    db.init_app(app)

    # Import des blueprints (routes)
    from .routes.favorites import favorites_bp
    app.register_blueprint(favorites_bp, url_prefix='/api/favorites')

    # Tu feras pareil pour cart et orders plus tard

    return app
