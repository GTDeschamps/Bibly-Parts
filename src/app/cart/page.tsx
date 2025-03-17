"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Partition {
	id: number;
	title: string;
	author: string;
	instrument: string;
	style: string;
	support: string;
	booklet: string;
	price: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<Partition[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Erreur lors du parsing du panier :", error);
      }
    }
  }, []);

  const handleRemoveFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = Number(cart.reduce((sum, item) => sum + (item.price || 0), 0));

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
      <div className="relative border-2 border-blue-600 p-6 rounded-lg shadow-md ">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Votre panier est vide.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((partition) => (
              <div key={partition.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <img
                    alt={partition.title}
                    className="w-12 h-12 rounded-md bg-gray-200"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{partition.title}</h3>
                    <p className="text-gray-600">{partition.booklet}</p>
                    <p className="text-gray-600">
                      {partition.author} - {partition.support}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleRemoveFromCart(partition.id)}
                    className="p-2 text-blue-500 hover:text-orange-500"
                  >
                    <Trash2 size={20} />
                  </button>
                  <span className="text-lg font-semibold">{partition.price}€</span>
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
