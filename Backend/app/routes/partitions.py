from flask_restx import Namespace, Resource, fields
from app.extensions import db
from app.models.partition import Partition

partitions_ns = Namespace('partitions', description="Gestion des partitions")

partition_model = partitions_ns.model('Partition', {
    'id': fields.Integer(readOnly=True),
    'title': fields.String(required=True),
    'author': fields.String,
    'description': fields.String,
    'booklet': fields.String,
    'style': fields.String,
    'instrument': fields.String,
    'type': fields.String(required=True, enum=['partition', 'tablature']),
    'cover_image': fields.String,  # URL de l’image (Cloudinary, etc.)
    'pdf_file': fields.String,     # URL du PDF
    'audio_file': fields.String,   # URL du .wav ou .mp3
    'price': fields.Float(required=True)
})

@partitions_ns.route('/')
class PartitionList(Resource):
    @partitions_ns.marshal_list_with(partition_model)
    def get(self):
        """Liste toutes les partitions"""
        return Partition.query.all()

    @partitions_ns.expect(partition_model)
    @partitions_ns.marshal_with(partition_model, code=201)
    def post(self):
        """Ajoute une nouvelle partition"""
        data = partitions_ns.payload
        new_partition = Partition(
            title=data['title'],
            author=data.get('author'),
            description=data.get('description'),
            booklet=data.get('booklet'),
            style=data.get('style'),
            instrument=data.get('instrument'),
            type=data['type'],
            cover_image=data.get('cover_image'),
            pdf_file=data.get('pdf_file'),
            audio_file=data.get('audio_file'),
            price=data['price']
        )
        db.session.add(new_partition)
        db.session.commit()
        return new_partition, 201

@partitions_ns.route('/<int:id>')
@partitions_ns.response(404, 'Partition non trouvée')
@partitions_ns.param('id', 'ID de la partition')
class PartitionDetail(Resource):
    @partitions_ns.marshal_with(partition_model)
    def get(self, id):
        """Récupère une partition par ID"""
        partition = Partition.query.get_or_404(id)
        return partition

    def delete(self, id):
        """Supprime une partition par ID"""
        partition = Partition.query.get_or_404(id)
        db.session.delete(partition)
        db.session.commit()
        return {"message": "Partition supprimée"}, 204
