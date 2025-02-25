"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Signup = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Vérifier si le paramètre "mode" existe et est égal à "login"
  const isLogin = searchParams?.get("mode") === "login";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(245,245,220)] bg-[url('/images/partition.png')] bg-cover">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-80 rounded-lg shadow-md">
        {isLogin ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Adresse Mail</label>
                <input type="email" className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-gray-700">Mot de Passe</label>
                <input type="password" className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500" />
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-blue-700 text-white font-semibold rounded-md hover:bg-orange-500 transition duration-300">Valider</button>
              <p className="text-center text-blue-700 cursor-pointer hover:text-orange-500" onClick={() => router.push("/signup?mode=signup")}>
                Mot de passe oublié?
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Création de compte</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Nom de compte</label>
                <input type="text" className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-gray-700">Adresse Mail</label>
                <input type="email" className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-gray-700">Mot de Passe</label>
                <input type="password" className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-gray-700">Confirmer le Mot de passe</label>
                <input type="password" className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500" />
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-blue-700 text-white font-semibold rounded-md hover:bg-orange-500 transition duration-300">Création de compte</button>
              <p className="text-center text-blue-700 cursor-pointer hover:text-orange-500" onClick={() => router.push("/signup?mode=login")}>
                Déjà un compte ? Se connecter
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
