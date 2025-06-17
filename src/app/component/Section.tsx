"use client";

import {
  Play,
  Heart,
  Info,
  ShoppingCart,
  Menu as MenuIcon,
  Ban,
  Download,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { useAudio } from "@/app/component/context/audioContext";

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
  Audio: string;
  isFavoritePage?: boolean;
  isCartPage?: boolean;
  pdfFileName?: string; // utile pour nommer le fichier téléchargé
  onUnfavorite?: () => void;
  onUnCart?: () => void;
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
  Cover,
  Audio,
  isFavoritePage = false,
  isCartPage = false,
  pdfFileName,
  onUnfavorite,
  onUnCart,
}: SectionProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTrackSrc, setTrackTitle, play } = useAudio();

  const token = getToken();

  const handlePlay = () => {
    if (Audio) {
      setTrackSrc(Audio);
      setTrackTitle(Title);
      play();
      console.log("Lecture du morceau :", Title);
    } else {
      console.warn("Pas d'URL audio disponible");
    }
  };

  const handleAddToFavorites = async () => {
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

  const handleRemoveFromCart = async () => {
    if (!token) return console.warn("Utilisateur non connecté");
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log("❌ Supprimé du panier");
        if (onUnCart) onUnCart();
      } else {
        const errorData = await response.json();
        console.error("Erreur de suppression du panier:", errorData);
      }
    } catch (error) {
      console.error("Erreur de suppression du panier:", error);
    }
  };

  const handleDownload = async () => {
    if (!token) return console.warn("Utilisateur non connecté");
    try {
      const response = await fetch(`http://localhost:5000/api/order/download/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors du téléchargement");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFileName || `${Title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement :", error);
    }
  };

  return (
    <div className="border-b last:border-none py-4 flex justify-between items-center">
      <Link
        href={`/description/${id}`}
        className="flex items-center space-x-4 hover:bg-blue-100 p-2 rounded-lg transition"
      >
        {Cover && (
          <img
            src={Cover}
            alt={`Couverture de ${Title}`}
            className="w-16 h-16 rounded-md bg-gray-200 object-cover"
          />
        )}
        <div>
          <p className="text-lg font-semibold">{Title}</p>
          <p className="text-gray-600">
            {Artiste} - {Type}
          </p>
        </div>
      </Link>

      <button onClick={() => setOpen(!open)} className="md:hidden">
        <MenuIcon size={20} />
      </button>

      <div className="hidden md:flex space-x-4">
        <button onClick={handlePlay} className="p-2 text-blue-500 hover:text-[#ff6100]">
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

        {isCartPage ? (
          <button
            onClick={handleRemoveFromCart}
            className="p-2 text-blue-500 hover:text-[#ff6100]"
          >
            <XCircle size={20} />
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="p-2 text-blue-500 hover:text-[#ff6100]"
          >
            <ShoppingCart size={20} />
          </button>
        )}

        <button
          onClick={handleDownload}
          className="p-2 text-blue-500 hover:text-[#ff6100]"
        >
          <Download size={20} />
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
              <Ban size={20} className="mr-2" /> Retirer favori
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

          {isCartPage ? (
            <button
              onClick={handleRemoveFromCart}
              className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
            >
              <XCircle size={20} className="mr-2" /> Retirer panier
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
            >
              <ShoppingCart size={20} className="mr-2" /> Panier
            </button>
          )}

          <button
            onClick={handleDownload}
            className="block w-full p-2 text-blue-500 rounded flex items-center hover:text-[#ff6100]"
          >
            <Download size={20} className="mr-2" /> Télécharger
          </button>
        </div>
      )}
    </div>
  );
};

export default Section;
