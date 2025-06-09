from flask import Flask, redirect
from flask_cors import CORS
from flask_restx import Api
from flask_jwt_extended import JWTManager  # 🔒 Ajout JWT

from app.extensions import db, migrate

# Initialisation du gestionnaire JWT
jwt = JWTManager()

# Création de l'objet Flask-RESTX (Swagger)
api = Api(
    title="BiblyParts API",
    version="1.0",
    description="API pour partitions, utilisateurs, favoris, etc.",
    doc="/docs"
)


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    # Configuration minimale pour JWT
    jwt.init_app(app)

    # Custom JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"message": "Le token a expiré.", "error": "token_expired"}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"message": "Signature invalide.", "error": "invalid_token"}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"message": "Le token est manquant.", "error": "authorization_required"}, 401

    # Configuration CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},  # Ou "http://localhost:3000" si Next.js
        expose_headers=["Authorization"],
        supports_credentials=True
    )

    # Initialisation des extensions
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    # Global error handler for the API
    @api.errorhandler(Exception)
    def handle_all_exceptions(error):
        """Catches all unhandled exceptions and returns a JSON response."""
        # You can log the error here for debugging
        # import traceback
        # traceback.print_exc()
        return {'message': f'Internal Server Error: {error}'}, 500

    @app.route("/")
    def index():
        return redirect("/docs")

    # Importation et ajout des namespaces API
    from app.routes.auth import auth_ns
    from app.routes.partitions import partitions_ns
    from app.routes.favorites import favorites_ns
    from app.routes.user import user_ns
    from app.routes.cart import cart_ns
    from app.routes.orders import orders_ns
    from app.routes.filter import filter_ns
    from app.routes.description import description_ns

    api.add_namespace(auth_ns, path="/api/auth")
    api.add_namespace(partitions_ns, path="/api/partitions")
    api.add_namespace(favorites_ns, path="/api/favorites")
    api.add_namespace(user_ns, path="/api/user")
    api.add_namespace(cart_ns, path="/api/cart")
    api.add_namespace(orders_ns, path="/api/orders")
    api.add_namespace(filter_ns, path="/api/filter")
    api.add_namespace(description_ns, path="/api/description")

    return app
