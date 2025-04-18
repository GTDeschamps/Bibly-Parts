class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:motdepasse@localhost:5432/bibly_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'super-secret-key'
