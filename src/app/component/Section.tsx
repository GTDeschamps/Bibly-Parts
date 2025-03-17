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

const Section = ({ id, title, author, instrument, style, support, booklet, price, isFavoritePage = false, onUnfavorite }: SectionProps) => {
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const router = useRouter();

  // 🔹 Chargement initial des favoris et du panier
  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch (error) {
      console.error("Erreur lors du chargement du localStorage :", error);
    }
  }, []);

  // 🔹 Sauvegarde des favoris
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 🔹 Sauvegarde du panier
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Ajout aux favoris
  const handleAddToFavorites = () => {
    if (!id) return console.error("L'ID est undefined !");
    const newFavorites = [...favorites, { id, title, author, instrument, style, support, booklet, price }];
    setFavorites(newFavorites);
    console.log("Ajouté aux favoris :", title);
  };

  // Suppression des favoris
  const handleRemoveFromFavorites = () => {
    const updatedFavorites = favorites.filter(partition => partition.id !== id);
    setFavorites(updatedFavorites);
    console.log("Retiré des favoris :", title);
    if (onUnfavorite) onUnfavorite();
  };

  // Ajout au panier
  const handleAddToCart = () => {
    console.log("Tentative d'ajout au panier - ID:", id);

    if (!id) {
      console.error("L'ID est undefined, impossible d'ajouter au panier !");
      return;
    }

    const partitionToAdd = { id, title, author, instrument, style, support, booklet, price };
    const updatedCart = [...cart, partitionToAdd];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    console.log(`Ajouté au panier :`, partitionToAdd);
  };

    // Suppression du panier
    const handleRemoveFromCart = () => {
      const updatedCart = cart.filter(partition => partition.id !== id);
      setCart(updatedCart);
      console.log("Retiré du panier :", title);
      if (onUnCart) onUnCart();
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
