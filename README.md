# Bibly-Parts

**Bibly-Parts** est un site web dédié à la distribution et à l'achat de partitions musicales.
Le projet propose une solution complète avec :
- Frontend en **Next.js / TypeScript / Tailwind CSS**
- Backend en **Flask / SQLAlchemy**
- Stockage des médias (PDF, audio, images) via **Cloudinary**

## ✨ Fonctionnalités principales

- **Gestion utilisateur complète** : création de compte, connexion, gestion de profil, modification du mot de passe, suppression de compte.
- **Base de données des partitions** : recherche par style, instrument, auteur, titre ; prévisualisation et pré-écoute.
- **Panier et favoris** : ajout, retrait, commande (simulée).
- **Design épuré** : couleurs crème et sépia, évoquant l’esthétique des anciennes partitions.

---

## 🚀 Lancer le projet en local

### 🔹 Prérequis

- **Node.js** + **npm** (ou yarn/pnpm)
- **Python 3**
- **Un environnement virtuel Python (recommandé)**

---

### 1️⃣ Lancer le backend

Dans le dossier `backend/` :

# Activez votre environnement virtuel si nécessaire
python3 -m venv venv
source venv/bin/activate  # sous Linux/Mac
# ou
venv\Scripts\activate  # sous Windows

pip install -r requirements.txt

# Démarrer le serveur Flask
python run.py
➡️ Le backend est accessible sur http://127.0.0.1:5000

---

### 2️⃣ Lancer le frontend
Dans le dossier frontend/ (ou racine si Next.js est à la racine) :

Copier le code
npm install
npm run dev
➡️ Le frontend est accessible sur http://localhost:3000

🧪 Exécuter les tests unitaires (backend)
Les tests se trouvent dans le dossier tests/.
Pour les exécuter :

bash
Copier le code
python -m unittest discover tests
✅ Les tests utilisent une base temporaire SQLite en mémoire.


🗂 Structure du projet
````bash
Copier le code
/backend
  /models         → Modèles SQLAlchemy
  /routes         → Routes Flask
  /static         → Fichiers statiques si nécessaire
  /templates      → Templates Jinja (si utilisés)
  run.py          → Lancement du serveur Flask
/frontend
  /app            → Composants Next.js (App Router)
  /public         → Fichiers publics
  /styles         → Fichiers Tailwind
/tests
  test_user.py    → Tests liés aux utilisateurs
  test_partition.py → Tests des partitions
README.md
``

🛠 Choix techniques
Next.js / React + Tailwind CSS pour le frontend

Flask + SQLAlchemy pour le backend

Cloudinary pour héberger les fichiers médias

JWT pour la gestion des tokens d'authentification

📦 Déploiement
Frontend : compatible déploiement sur Vercel

Backend : prêt pour un hébergement Python (Railway, Render, VPS…)

📌 Accès au projet
Frontend : http://localhost:3000

Backend : http://127.0.0.1:5000

🔗 Ressources utiles
Next.js Documentation

Flask Documentation

SQLAlchemy Documentation

Tailwind CSS

Cloudinary

🤝 Auteurs
Ce projet a été réalisé par Gaël Deschamps dans le cadre d’un projet RNCP Niveau 6, sanctionnant un formation de Developpeur FullStack au sein d'Holberton School Laval.
