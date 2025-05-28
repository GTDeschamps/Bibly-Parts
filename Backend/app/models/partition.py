from app import db


class Partition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    artiste = db.Column(db.String(100))
    booklet = db.Column(db.String(120))
    style = db.Column(db.String(80))
    instrument = db.Column(db.String(80))
    type = db.Column(db.String(80))  # partition ou tablature
    price = db.Column(db.Float)

    cover_image = db.Column(db.String)  # URL de l’image (Cloudinary, etc.)
    pdf_file = db.Column(db.String)     # URL du PDF
    audio_file = db.Column(db.String)   # URL du .wav ou .mp3
