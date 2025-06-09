# app/routes/description.py
from flask_restx import Namespace, Resource
from app.models.partition import Partition
from app.extensions import db

description_ns = Namespace("description", description="Description des partitions")

@description_ns.route("/<int:id>")
class DescriptionResource(Resource):
    def get(self, id):
        partition = Partition.query.get_or_404(id)
        return {
            "id": partition.id,
            "title": partition.title,
            "description": partition.description,
            "PdfFile": partition.pdf_file,
            "cover_image": partition.cover_image,
            "price": partition.price,
            "artiste": partition.artiste,
            "instrument": partition.instrument,
            "type": partition.type,
            "style": partition.style,
            "booklet": partition.booklet,
            "AudioFile": partition.AudioFile,
        }
