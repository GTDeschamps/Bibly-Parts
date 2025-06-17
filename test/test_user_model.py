import unittest
from Backend.app import app, db
from Backend.app.models.user import User

class UserModelTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_create_user(self):
        user = User(username="testuser", email="test@example.com", password_hash="hashedpwd")
        db.session.add(user)
        db.session.commit()
        retrieved = User.query.filter_by(username="testuser").first()
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.email, "test@example.com")

    def test_unique_email(self):
        user1 = User(username="user1", email="unique@example.com", password_hash="pwd1")
        db.session.add(user1)
        db.session.commit()
        user2 = User(username="user2", email="unique@example.com", password_hash="pwd2")
        db.session.add(user2)
        with self.assertRaises(Exception):
            db.session.commit()
