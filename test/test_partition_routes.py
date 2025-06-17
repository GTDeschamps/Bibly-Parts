import unittest
from Backend.app import app, db
from Backend.app.models.partition import Partition

class PartitionRouteTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

        # Add dummy partition
        p = Partition(title="Sample", artist="Artist", price=10)
        db.session.add(p)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_get_partitions(self):
        response = self.client.get('/api/partitions')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Sample', str(response.data))
