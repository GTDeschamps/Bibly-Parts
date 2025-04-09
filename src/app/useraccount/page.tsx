"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {app} from "@/lib/firebaseConfig"; // Assurez-vous que le chemin est correct

const UserAccount = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        // Redirige si l'utilisateur n'est pas connecté
        router.push("/signup?mode=login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <div className="text-center mt-10 text-gray-700">Chargement des données du compte...</div>;
  }

  return (
    <div className="bg-beige min-h-screen flex justify-center items-center p-8 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>
      <div className="bg-transparent p-6 w-full max-w-2xl relative">
        <div className="grid grid-cols-1 gap-6 place-items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border border-blue-700">
            <span className="text-gray-600">image de compte</span>
          </div>
          <div className="w-full">
            <label className="block font-bold">Nom d'utilisateur</label>
            <input
              type="text"
              value={user.displayName || "Non renseigné"}
              className="w-full p-2 bg-gray-300 border border-blue-700 rounded-md"
              readOnly
            />

            <label className="block font-bold mt-4">Adresse Mail</label>
            <input
              type="email"
              value={user.email}
              className="w-full p-2 bg-gray-300 border border-blue-700 rounded-md"
              readOnly
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around text-blue-700 font-semibold underline">
          <a href="#">Mes Favoris</a>
          <a href="#">Historique de Commande</a>
          <a href="#">Panier</a>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
