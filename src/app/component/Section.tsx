"use client";

import { Play, Heart, Info, ShoppingCart, Menu as MenuIcon, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SectionProps {
  id: string;
  title: string;
  author: string;
  instrument: string;
  style: string;
  support: string;
  booklet: string;
  price: number;
  isFavoritePage?: boolean;
  onUnfavorite?: () => void;
  onUnCart?: () => void;
}

interface Partition {
  id: string;
  title: string;
  author: string;
  instrument: string;
  style: string;
  support: string;
  booklet: string;
  price: number;
}
const Section = ({ id, title, author, instrument, style, support, booklet, price, isFavoritePage = false, onUnfavorite }: SectionProps) => {
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<Partition[]>([]);
  const [cart, setCart] = useState<Partition[]>([]);
  const router = useRouter();


  // 🔹 Chargement initial des favoris
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");

      if (storedFavorites) {
        console.log("🟢 Favoris récupérés après rechargement :", JSON.parse(storedFavorites));
        setFavorites(JSON.parse(storedFavorites));
      } else {
        console.warn("🟠 Aucun favoris trouvé après rechargement.");
        setFavorites([]);
      }
    } catch (error) {
      console.error("🔴 Erreur lors du chargement des favoris :", error);
      setFavorites([]);
    }
  }, []);

    // 🔹 Chargement initial du panier
    useEffect(() => {
      try {
        const storedCart = localStorage.getItem("cart");

        if (storedCart) {
          console.log("🟢 Panier récupérés après rechargement :", JSON.parse(storedCart));
          setCart(JSON.parse(storedCart));
        } else {
          console.warn("🟠 Panier vide après rechargement.");
          setCart([]);
        }
      } catch (error) {
        console.error("🔴 Erreur lors du chargement du panier :", error);
        setCart([]);
      }
    }, []);


  // 🔹 Sauvegarde des favoris
  useEffect(() => {
    if (favorites.length > 0) { // 🔥 Ne met à jour que si `favorites` contient quelque chose
      console.log("✅ Mise à jour de localStorage avec :", favorites);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    // } else (favorites.length = 0); {
    //   console.warn("⚠️ Évité d'écraser localStorage avec une liste vide.");
    }
  }, [favorites]);


  // Ajout aux favoris
  const handleAddToFavorites = () => {
    if (!id) return console.error("❌ L'ID est undefined, impossible d'ajouter aux favoris !");

    const partitionToAdd: Partition = { id, title, author, instrument, style, support, booklet, price };

    // 🔹 Récupérer les favoris ACTUELS depuis localStorage
    const storedFavorites = localStorage.getItem("favorites");
    const existingFavorites: Partition[] = storedFavorites ? JSON.parse(storedFavorites) : [];

    console.log("📌 Favoris AVANT ajout :", existingFavorites);

    // 🔹 Vérifier si l’élément existe déjà
    if (existingFavorites.some((fav) => fav.id === id)) {
      console.warn("⚠️ Cette partition est déjà dans les.");
      return;
    }

    // 🔹 Ajouter la nouvelle partition aux favoris
    const updatedFavorites = [...existingFavorites, partitionToAdd];

    console.log("✅ Favoris APRÈS ajout :", updatedFavorites);

    // 🔹 Mettre à jour localStorage et l’état
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };



  // ✅ **Suppression des favoris (corrigé)**
  const handleRemoveFromFavorites = () => {
    console.log(`🔴 Suppression de la partition avec ID : ${id}`);

    // Mettre à jour localStorage
    const updatedFavorites = favorites.filter((partition) => partition.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Mettre à jour l'état local
    setFavorites(updatedFavorites);

    // 🔥 Informer la page principale (FavoritesPage) qu'on a supprimé un élément
    if (onUnfavorite) {
        onUnfavorite();
    }
};


   // ✅ **Ajout au panier sans écraser les anciens éléments**
   const handleAddToCart = () => {
    if (!id) return console.error("❌ L'ID est undefined, impossible d'ajouter au Panier !");

    const partitionToAdd: Partition = { id, title, author, instrument, style, support, booklet, price };

    // 🔹 Récupérer le panier actuel depuis localStorage
    const storedCart = localStorage.getItem("cart");
    const existingCart: Partition[] = storedCart ? JSON.parse(storedCart) : [];

    console.log("📌 PANIER AVANT ajout :", existingCart);

    // 🔹 Vérifier si l’élément existe déjà
    if (existingCart.some((cart) => cart.id === id)) {
      console.warn("⚠️ Cette partition est déjà dans le panier.");
      return;
    }

    // 🔹 Ajouter la nouvelle partition au panier
    const updatedCart = [...existingCart, partitionToAdd];

    console.log("✅ Panier APRÈS ajout :", updatedCart);

    // 🔹 Mettre à jour localStorage et l’état
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Lecture du morceau
  const handlePlay = () => console.log(`Lecture du morceau : ${title}`);

  return (
    <div className="border-b last:border-none py-4 flex justify-between items-center">
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-gray-600">{author} - {support}</p>
      </div>

      <button onClick={() => setOpen(!open)} className="md:hidden">
        <MenuIcon size={20} />
      </button>

      <div className="hidden md:flex space-x-4">
        <button onClick={handlePlay} className="p-2 text-blue-500 hover:text-[#ff6100]">
          <Play size={20} />
        </button>
        {isFavoritePage ? (
          <button onClick={handleRemoveFromFavorites} className="p-2 text-blue-500 hover:text-[#ff6100]">
            <Ban size={20} />
          </button>
        ) : (
          <button onClick={handleAddToFavorites} className="p-2 text-blue-500 hover:text-[#ff6100]">
            <Heart size={20} />
          </button>
        )}

        <button onClick={() => router.push(`/description/${id}`)} className="p-2 text-blue-500 hover:text-[#ff6100]">
          <Info size={20} />
        </button>
        <button onClick={handleAddToCart} className="p-2 text-blue-500 hover:text-[#ff6100]">
          <ShoppingCart size={20} />
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-2 space-y-2">
          <button onClick={handlePlay} className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]">
            <Play size={20} className="mr-2" /> Pré-écoute
          </button>
          {isFavoritePage ? (
            <button onClick={handleRemoveFromFavorites} className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]">
              <Ban size={20} className="mr-2" /> Retirer
            </button>
          ) : (
            <button onClick={handleAddToFavorites} className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]">
              <Heart size={20} className="mr-2" /> Favoris
            </button>
          )}
          <button onClick={() => router.push(`/description/${id}`)} className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]">
            <Info size={20} className="mr-2" /> Description
          </button>
          <button onClick={handleAddToCart} className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]">
            <ShoppingCart size={20} className="mr-2" /> Panier
          </button>
        </div>
      )}
    </div>
  );
};

export default Section;
