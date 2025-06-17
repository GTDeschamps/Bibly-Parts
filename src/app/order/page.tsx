"use client";

import React, { useState, useEffect } from "react";
import Section from "../component/Section";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");

      const res = await fetch("http://localhost:5000/api/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Échec du chargement des commandes");

      const data = await res.json();
      console.log("Données commandes :", data);
      setOrders(data.reverse());
    } catch (err: any) {
      console.error("❌ Erreur chargement commandes :", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#f5f5dc] min-h-screen p-8">
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
        style={{
          backgroundImage:
            "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
        }}
      ></div>

      <h1 className="text-xl font-bold text-center mb-6">Historique de commande</h1>

      <div className="relative border-2 border-blue-600 p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-center text-blue-800">Chargement...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">Aucune commande passée pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((item) => (
              <Section
                key={item.order_id}
                id={item.partition_id}
                Cover={item.cover_image}
                Title={item.title}
                Artiste={item.artiste}
                Instrument={item.instrument}
                Style={item.style}
                Type={item.type}
                Booklet={item.booklet}
                Price={item.price}
                isOrderPage={true} // Tu pourras l'utiliser dans Section pour afficher bouton téléchargement
                PdfFile={item.pdf_file} // lien vers le PDF
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
