"use client";

import Image from 'next/image';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Play, Heart, ShoppingCart, X } from "lucide-react";

const PartitionDescription = () => {
  const { id } = useParams();
  const [partition, setPartition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getPreviewLink = (url?: string) => {
    if (!url) return "";
    const regex = /\/file\/d\/([^\/]+)\//;
    const match = url.match(regex);
    if (!match || !match[1]) return url;
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  };

  useEffect(() => {
    const fetchPartition = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/partitions/${id}`);
        if (!res.ok) throw new Error("Erreur de chargement");

        const data = await res.json();
        setPartition(data);
      } catch (err: any) {
        console.error("❌", err);
        setError("Partition introuvable");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPartition();
  }, [id]);

  if (loading) return <p className="text-center text-blue-900 mt-10">Chargement...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!partition) return null;

  return (
    <div className="bg-beige min-h-screen p-6 flex flex-col items-center relative w-full">
      {/* Filigrane */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
        style={{
          backgroundImage:
            "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
        }}
      ></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl relative z-10">
        {/* Image + Prévisualisation */}
        <div className="flex flex-col items-center col-span-1">
          <div className="border border-blue-500 p-2 bg-gray-200 rounded-lg">
            <img
              src={partition.cover_image}
              alt={partition.title}
              className="w-[120px] h-[160px] object-cover rounded"
            />
          </div>

          {!showPreview ? (
            <button
              onClick={() => setShowPreview(true)}
              className="border border-blue-500 p-2 mt-4 bg-gray-200 rounded-lg w-full text-center text-blue-700 hover:text-orange-500"
            >
              Voir le PDF
            </button>
          ) : (
            <div className="mt-4 relative border border-blue-500 bg-white rounded-lg w-full overflow-hidden">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                title="Fermer l’aperçu"
              >
                <X size={16} />
              </button>
              <iframe
                src={getPreviewLink(partition.pdf_file)}
                title="Aperçu PDF"
                className="w-full"
                style={{
                  minHeight: '500px',
                  width: "100%",
                }}
              />
            </div>
          )}
        </div>

        {/* Infos principales */}
        <div className="col-span-2 flex flex-col">
          <h3 className="text-gray-600">{partition.artiste}</h3>
          <h1 className="text-2xl font-bold">{partition.title}</h1>
          <p className="text-gray-600">Instrument: {partition.instrument}</p>
          <p className="text-gray-600">Support: {partition.type}</p>

          <div className="border border-blue-500 bg-gray-100 p-4 mt-4 rounded-lg flex-grow">
            <p>{partition.description || "Aucune description disponible."}</p>
          </div>
        </div>

        {/* Boutons */}
        <div className="col-span-1 flex justify-end gap-4 items-start flex-col">
          {partition.AudioFile && (
            <audio controls className="w-full">
              <source src={partition.AudioFile} type="audio/wav" />
              Votre navigateur ne supporte pas l’audio.
            </audio>
          )}

          <button className="flex items-center gap-1 text-blue-500 hover:text-orange-500 text-sm">
            <Heart size={14} />
            Favori
          </button>

          <button className="flex items-center gap-1 text-blue-500 hover:text-orange-500 text-sm">
            <ShoppingCart size={14} />
            {partition.price}€
          </button>
        </div>
      </div>

      {/* Tags (optionnel) */}
      <div className="max-w-6xl w-full mt-6 border border-blue-500 bg-gray-100 rounded-lg p-4 text-center z-10">
        <p className="text-sm text-gray-700">
          Style : {partition.style} | Livret : {partition.booklet}
        </p>
      </div>
    </div>
  );
};

export default PartitionDescription;
