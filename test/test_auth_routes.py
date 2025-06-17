import unittest
import json
from Backend.app import app, db
from Backend.app.models.user import User

class AuthRouteTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register(self):
        response = self.client.post('/api/register', json={
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'securepwd'
        })
        self.assertEqual(response.status_code, 201)

    def test_login_fail(self):
        response = self.client.post('/api/login', json={
            'email': 'nouser@example.com',
            'password': 'wrong'
        })
        self.assertEqual(response.status_code, 401)
