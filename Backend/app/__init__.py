from flask import Flask, redirect
from flask_cors import CORS
from flask_restx import Api

from app.extensions import db, migrate

# Création de l'objet Flask-RESTX
api = Api(
    title="BiblyParts API",
    version="1.0",
    description="API pour partitions, utilisateurs, favoris, etc.",
    doc="/docs"  # Swagger UI
)

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # Initialisation de l'API avec l'application Flask
    api.init_app(app)

    # Route d’accueil qui redirige vers /docs
    @app.route("/")
    def index():
        return redirect("/docs")

    # Importation et ajout des namespaces
    from app.routes.auth import auth_ns
    from app.routes.partitions import partitions_ns
    from app.routes.favorites import favorites_ns
    from app.routes.user import user_ns
    from app.routes.cart import cart_ns
    from app.routes.orders import orders_ns
    from app.routes.filter import filter_ns

    api.add_namespace(auth_ns, path="/api/auth")
    api.add_namespace(partitions_ns, path="/api/partitions")
    api.add_namespace(favorites_ns, path="/api/favorites")
    api.add_namespace(user_ns, path="/api/user")
    api.add_namespace(cart_ns, path="/api/cart")
    api.add_namespace(orders_ns, path="/api/orders")
    api.add_namespace(filter_ns, path="/api/filter")

    return app
