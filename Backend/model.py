from flask import request, jsonify
from firebase_admin import firestore
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

db = firestore.client()  # Récupération de l'instance Firestore
bcrypt = Bcrypt()

class User:
    def __init__(self, email, password):
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        # Pas besoin de gérer l'ID ici, Firestore le fera

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "email": self.email,
            "password": self.password,
            # Pas besoin de 'created_at', vous pouvez utiliser une fonction Firestore si nécessaire
        }

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Vérifiez si l'utilisateur existe déjà
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).get()

    if query:
        # L'email existe déjà
        return jsonify({"message": "Email déjà utilisé"}), 400

    user = User(email, password)
    user_data = user.to_dict()

    # Enregistrez l'utilisateur dans Firestore
    db.collection('users').document().set(user_data)

    return jsonify({"message": "Utilisateur enregistré avec succès"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Récupérez l'utilisateur depuis Firestore
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).limit(1).get()

    if not query:
        return jsonify({"message": "Email ou mot de passe incorrect"}), 401

    user_doc = query[0]  # Récupère le premier (et unique) résultat
    user_data = user_doc.to_dict()

    user = User(user_data['email'], user_data['password']) # Reconstitution d'un objet User

    if user.check_password(password):
        # Générer un token JWT (exemple utilisant Flask-JWT-Extended)
        # access_token = create_access_token(identity=user_doc.id) # Utiliser l'ID Firestore
        # return jsonify(access_token=access_token), 200
        return jsonify({"message": "Connexion réussie"}), 200 # Renvoyer un message pour le moment
    else:
        return jsonify({"message": "Email ou mot de passe incorrect"}), 401
