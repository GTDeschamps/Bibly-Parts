"use client";

import { Play, Heart, Info, ShoppingCart, Menu as MenuIcon, FileText, Ban } from "lucide-react";
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
}

const Section = ({ id, title, author, instrument, style, support, booklet, price, isFavoritePage = false, onUnfavorite }: SectionProps) => {
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const handleAddToFavorites = () => {
    if (!id) {
      console.error("L'ID est undefined, impossible de remonter cette partition !");
      return; // Empêche d'ajouter un élément invalide
    }
    const partitionToAdd = { id, title, author, instrument, style, support, booklet, price }; // Création de l'objet complet

    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    const updatedFavorites = [...favorites, partitionToAdd]; // Stocker l'objet entier
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    console.log("Ajouté aux favoris :", partitionToAdd);
  };


  const handleRemoveFromFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    const updatedFavorites = favorites.filter(partition => partition && partition.id !== id); // Filtrer par ID
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    console.log(`Retiré des favoris :`, id);
    if (onUnfavorite) onUnfavorite();
  };


  const handleAddToCart = () => {
    const updatedCart = [...cart, id];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log(`Ajouté au panier : ${id}`);
  };

  const handlePlay = () => {
    console.log(`Lecture du morceau : ${id}`);
  };

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
