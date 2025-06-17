import unittest
from Backend.app import app, db
from Backend.app.models.order import Order

class CommandeModelTestCase(unittest.TestCase):
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

    def test_create_commande(self):
        commande = Order(user_id=1, total_price=15.0)
        db.session.add(commande)
        db.session.commit()
        retrieved = Order.query.first()
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.total_price, 15.0)
