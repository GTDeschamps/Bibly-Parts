from flask_restx import Namespace, Resource, fields, reqparse
from app.models.partition import Partition

filter_ns = Namespace('filter', description="Recherche de partitions")

partition_model = filter_ns.model('Partition', {
    'id': fields.Integer,
    'title': fields.String,
    'author': fields.String,
    'description': fields.String,
    'style': fields.String,
    'instrument': fields.String,
    'type': fields.String,
    'booklet': fields.String,
    'price': fields.Float
})

parser = reqparse.RequestParser()
parser.add_argument('style', type=str)
parser.add_argument('instrument', type=str)
parser.add_argument('type', type=str)
parser.add_argument('booklet', type=str)
parser.add_argument('keyword', type=str)

@filter_ns.route('/')
class PartitionFilter(Resource):
    @filter_ns.expect(parser)
    @filter_ns.marshal_list_with(partition_model)
    def get(self):
        """Filtre les partitions selon les critères"""
        args = parser.parse_args()
        query = Partition.query

        if args['style']:
            query = query.filter(Partition.style.ilike(f"%{args['style']}%"))
        if args['instrument']:
            query = query.filter(Partition.instrument.ilike(f"%{args['instrument']}%"))
        if args['type']:
            query = query.filter(Partition.type.ilike(f"%{args['type']}%"))
        if args['booklet']:
            query = query.filter(Partition.booklet.ilike(f"%{args['booklet']}%"))
        if args['keyword']:
            keyword = f"%{args['keyword']}%"
            query = query.filter(
                (Partition.title.ilike(keyword)) |
                (Partition.author.ilike(keyword))
            )

        return query.all()
