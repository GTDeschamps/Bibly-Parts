"use client";

import {
  Play,
  Heart,
  Info,
  ShoppingCart,
  Menu as MenuIcon,
  Ban,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { getToken } from "@/lib/auth";

interface SectionProps {
  id: string;
  Title: string;
  Artiste: string;
  Instrument: string;
  Style: string;
  Type: string;
  Booklet: string;
  Price: number;
  Cover: string;
  isFavoritePage?: boolean;
  onUnfavorite?: () => void;
  onUnCart?: () => void;
}

interface Partition {
  id: string;
  Title: string;
  Artiste: string;
  Instrument: string;
  Style: string;
  Type: string;
  Booklet: string;
  Price: number;
  Cover: string;
}


const Section = ({
  id,
  Title,
  Artiste,
  Instrument,
  Style,
  Type,
  Booklet,
  Price,
  Cover, // ✅ Ajouté ici
  isFavoritePage = false,
  onUnfavorite,
}: SectionProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();


  const title = Title || "Titre inconnu";
  const artiste = Artiste || "Artiste inconnu";
  const type = Type || "Type inconnu";
  const instrument = Instrument || "Instrument inconnu";
  const style = Style || "Style inconnu";
  const booklet = Booklet || "Booklet inconnu";
  const price = Price || 0;
  const cover = Cover; // ✅ fallback s’il manque

  const partitionData: Partition = {
    id,
    Title: title,
    Artiste: artiste,
    Instrument: instrument,
    Style: style,
    Type: type,
    Booklet: booklet,
    Price: price,
    Cover: cover,
  };

  const handleAddToFavorites = async () => {
    const token = getToken();
    if (!token) return console.warn("Utilisateur non connecté");
    try {
      const response = await fetch("http://localhost:5000/api/favorites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partition_id: parseInt(id) }),
      });
      if (response.ok) {
        console.log("✅ Ajouté aux favoris");
      } else {
        const errorData = await response.text();
        console.error("Erreur lors de l'ajout aux favoris:", errorData);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
    }
  };

  const handleRemoveFromFavorites = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log("❌ Supprimé des favoris");
        if (onUnfavorite) onUnfavorite();
      } else {
        const errorData = await response.json();
        console.error("Erreur de suppression:", errorData);
      }
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  };

  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) return console.warn("Utilisateur non connecté");
    try {
      const response = await fetch("http://localhost:5000/api/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partition_id: parseInt(id) }),
      });
      if (response.ok) {
        console.log("✅ Ajouté au panier");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'ajout au panier:", errorData);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  const handlePlay = () => console.log(`Lecture du morceau : ${Title}`);

  return (
    <div className="border-b last:border-none py-4 flex justify-between items-center">
      {/* ✅ Image de couverture */}
      <Link href={`/description/${id}`} className="flex items-center space-x-4 hover:bg-blue-100 p-2 rounded-lg transition">
  {cover && (
    <img
      src={cover}
      alt={`Couverture de ${title}`}
      className="w-16 h-16 rounded-md bg-gray-200 object-cover"
    />
  )}
  <div>
    <p className="text-lg font-semibold">{title}</p>
    <p className="text-gray-600">
      {artiste} - {type}
    </p>
  </div>
</Link>


      <button onClick={() => setOpen(!open)} className="md:hidden">
        <MenuIcon size={20} />
      </button>

      <div className="hidden md:flex space-x-4">
        <button
          onClick={handlePlay}
          className="p-2 text-blue-500 hover:text-[#ff6100]"
        >
          <Play size={20} />
        </button>
        {isFavoritePage ? (
          <button
            onClick={handleRemoveFromFavorites}
            className="p-2 text-blue-500 hover:text-[#ff6100]"
          >
            <Ban size={20} />
          </button>
        ) : (
          <button
            onClick={handleAddToFavorites}
            className="p-2 text-blue-500 hover:text-[#ff6100]"
          >
            <Heart size={20} />
          </button>
        )}
        <button
          onClick={() => router.push(`/description/${id}`)}
          className="p-2 text-blue-500 hover:text-[#ff6100]"
        >
          <Info size={20} />
        </button>
        <button
          onClick={handleAddToCart}
          className="p-2 text-blue-500 hover:text-[#ff6100]"
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-2 space-y-2">
          <button
            onClick={handlePlay}
            className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
          >
            <Play size={20} className="mr-2" /> Pré-écoute
          </button>
          {isFavoritePage ? (
            <button
              onClick={handleRemoveFromFavorites}
              className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
            >
              <Ban size={20} className="mr-2" /> Retirer
            </button>
          ) : (
            <button
              onClick={handleAddToFavorites}
              className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
            >
              <Heart size={20} className="mr-2" /> Favoris
            </button>
          )}
          <button
            onClick={() => router.push(`/description/${id}`)}
            className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
          >
            <Info size={20} className="mr-2" /> Description
          </button>
          <button
            onClick={handleAddToCart}
            className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
          >
            <ShoppingCart size={20} className="mr-2" /> Panier
          </button>
        </div>
      )}
    </div>
  );
};

export default Section;
