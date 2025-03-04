"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

// Chargement dynamique du router pour éviter l'erreur côté serveur
const useRouter = dynamic(() => import("next/router").then((mod) => mod.useRouter), { ssr: false });

interface Partition {
  id: number;
  title: string;
  album: string;
  author: string;
  price: number;
}

const Panier = () => {
  const [cart, setCart] = useState<Partition[]>([]);
  const router = useRouter();

  // Exemple de données à remplacer par une récupération depuis un état global ou une API
  useEffect(() => {
    setCart([
      { id: 1, title: "Tourne les violons", album: "Chanson pour les pieds", author: "Jean-Jacques Goldman", price: 12.99 },
      { id: 2, title: "Là-bas", album: "Entre gris clair et gris foncé", author: "Jean-Jacques Goldman", price: 10.50 }
    ]);
  }, []);

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((total, partition) => total + partition.price, 0);

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20" style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>
      <h1 className="text-2xl font-bold mb-4">Panier</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((partition) => (
            <div
              key={partition.id}
              className="flex justify-between items-center p-4 border border-blue-600 rounded-lg shadow-md"
            >
              <div>
                <h2 className="text-lg font-semibold">{partition.title}</h2>
                <p className="text-sm text-gray-600">{partition.album} - {partition.author}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">{partition.price.toFixed(2)}€</span>
                <button
                  onClick={() => removeFromCart(partition.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
           <div className="flex justify-end">
            <div className="p-4 border border-blue-600 rounded-lg shadow-md text-right w-50">
              <h2 className="text-xl font-bold">TOTAL: {totalPrice.toFixed(2)}€</h2>
              <button
                onClick={() => router.push("/paiement")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Commander
              </button>
          </div>
        </div>
    </div>
      )}
    </div>
  );
};

export default Panier;
