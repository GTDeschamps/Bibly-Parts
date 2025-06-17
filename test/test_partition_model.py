import unittest
from Backend.app import app, db
from Backend.app.models.partition import Partition

class PartitionModelTestCase(unittest.TestCase):
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

    def test_create_partition(self):
        partition = Partition(title="Test Song", artist="Test Artist", price=5.0)
        db.session.add(partition)
        db.session.commit()
        retrieved = Partition.query.filter_by(title="Test Song").first()
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.artist, "Test Artist")
