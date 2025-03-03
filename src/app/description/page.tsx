"use client";

import Image from 'next/image';
import { Play, Heart, ShoppingCart } from 'lucide-react';

const PartitionDescription = () => {
  return (
    <div className="bg-beige min-h-screen p-6 flex flex-col items-center relative w-full">
      {/* Filigrane */}
      <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20" style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>

      {/* Conteneur principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl">
        {/* Partie gauche: Image et Prévisualisation */}
        <div className="flex flex-col items-center col-span-1">
          <div className="border border-blue-500 p-2 bg-gray-200 rounded-lg">
            <Image src="/placeholder.png" width={120} height={160} alt="Couverture" />
          </div>
          <div className="border border-blue-500 p-2 mt-4 bg-gray-200 rounded-lg w-full text-center">Prévisualisation</div>
        </div>

        {/* Partie centrale: Infos et description */}
        <div className="col-span-2 flex flex-col">
          <h3 className="text-gray-600">Kees Rosenhart</h3>
          <h1 className="text-2xl font-bold">The Amsterdam Harpsichord Tutor</h1>
          <p className="text-gray-600">Instrument: Piano</p>
          <p className="text-gray-600">Support: Partition</p>

          {/* Description */}
          <div className="border border-blue-500 bg-gray-100 p-4 mt-4 rounded-lg flex-grow">
            <p>Résumé / Description de la partition...</p>
          </div>
        </div>

        {/* Boutons en haut à droite */}
        <div className="col-span-1 flex justify-end gap-4 items-start">
          <button className="flex items-center gap-1 text-blue-500 hover:text-orange-500 text-sm">
            <Play size={14} />
            Écouter
          </button>
          <button className="flex items-center gap-1 text-blue-500 hover:text-orange-500 text-sm">
            <Heart size={14} />
            Favori
          </button>
          <button className="flex items-center gap-1 text-blue-500 hover:text-orange-500 text-sm">
            <ShoppingCart size={14} />
            12€
          </button>
        </div>
      </div>

      {/* Zone des mots-clés et suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl mt-6">
        {/* Mots-clés */}
        <div className="col-span-3 border border-blue-500 bg-gray-100 p-2 rounded-lg text-center text-sm flex justify-center">
          <p className="truncate">Liste de mots-clés</p>
        </div>

        {/* Suggestions */}
        <div className="col-span-1 border border-blue-500 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold">Suggestion</h2>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/placeholder.png" width={40} height={40} alt="Suggestion" />
                <p>Chanson pour les pieds - Jean-Jacques Goldman</p>
              </div>
              <button className="text-blue-500 hover:text-orange-500 text-sm">
                <Heart size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/placeholder.png" width={40} height={40} alt="Suggestion" />
                <p>Best Of - Téléphone</p>
              </div>
              <button className="text-blue-500 hover:text-orange-500 text-sm">
                <Heart size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/placeholder.png" width={40} height={40} alt="Suggestion" />
                <p>Ce que je sais - Johnny Hallyday</p>
              </div>
              <button className="text-blue-500 hover:text-orange-500 text-sm">
                <Heart size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartitionDescription;
