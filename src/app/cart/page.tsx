"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { fetchCart } from "@/lib/FirebaseIntegration"; // 🔥 à créer si pas encore fait

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const items = await fetchCart(user.uid);
        setCart(items);
      } else {
        setCart([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveFromCart = async (id: string) => {
    if (!userId) return;
    try {
      const cartRef = doc(db, `users/${userId}/cart`, id);
      await deleteDoc(cartRef);
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erreur suppression cart Firestore:", err);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.Price || 0), 0);

  if (loading) return <p className="text-center text-blue-800">Chargement du panier...</p>;

  return (
    <div className="bg-[#f5f5dc] min-h-screen p-8 relative">
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
        style={{
          backgroundImage:
            "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
        }}
      ></div>

      <h1 className="text-xl font-bold text-center mb-6">Mon Panier</h1>

      <div className="relative border-2 border-blue-600 p-6 rounded-lg shadow-md">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Votre panier est vide.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((partition) => (
              <div key={partition.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <img
                    src={partition.Cover}
                    alt={partition.Title}
                    className="w-12 h-12 rounded-md bg-gray-200"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{partition.Title}</h3>
                    <p className="text-gray-600">{partition.Booklet}</p>
                    <p className="text-gray-600">{partition.Artiste} - {partition.Type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleRemoveFromCart(partition.id)}
                    className="p-2 text-blue-500 hover:text-orange-500"
                  >
                    <Trash2 size={20} />
                  </button>
                  <span className="text-lg font-semibold">{partition.Price}€</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="mt-6 flex justify-end">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md text-right w-64 border border-blue-600">
            <p className="text-xl font-bold">Total: {totalPrice.toFixed(2)} €</p>
            <button
              onClick={() => router.push("/paiement")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 w-full"
            >
              Commander
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
