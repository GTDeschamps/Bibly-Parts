class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://gdeschamps:S3cur1ty-4g3nt@localhost:5432/bibly_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'super-secret-key'
    JWT_SECRET_KEY = 'super-jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 heure
