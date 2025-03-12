"use client";

import React, { useState, useEffect } from "react";
import Section from "../component/Section";

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
const FavoritesPage: React.FC = () => {
	const [favorites, setFavorites] = useState<Partition[]>([]);

	// Charger les favoris depuis localStorage si l'utilisateur est connecté
	useEffect(() => {
		const storedFavorites = localStorage.getItem("favorites");
		if (storedFavorites) {
		  try {
			const parsedFavorites = JSON.parse(storedFavorites);
			console.log("Données récupérées depuis localStorage :", parsedFavorites);

			if (Array.isArray(parsedFavorites)) {
			  // Vérifier que chaque élément a bien toutes ses propriétés
			  const validFavorites = parsedFavorites.filter(
				(item) =>
				  item &&
				  typeof item === "object" &&
				  "id" in item &&
				  "title" in item &&
				  "author" in item &&
				  "instrument" in item &&
				  "style" in item &&
				  "support" in item &&
				  "booklet" in item &&
				  "price" in item
			  );

			  console.log("Partitions valides après filtrage :", validFavorites);
			  setFavorites(validFavorites);
			} else {
			  setFavorites([]);
			}
		  } catch (error) {
			console.error("Erreur lors du parsing des favoris :", error);
			setFavorites([]);
		  }
		} else {
		  setFavorites([]);
		}
	  }, []);


	// Supprimer un favori
	const removeFromFavorites = (id: number) => {
	  const updatedFavorites = favorites.filter((partition) => partition.id !== id);
	  setFavorites(updatedFavorites);
	  // Mise à jour dans localStorage
	  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
	};

	return (
		<div className="bg-[#f5f5dc] min-h-screen p-8">
			<div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20" style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>
			<h1 className="text-xl font-bold text-center mb-6">
				Mes Partitions Favorites
			</h1>
			<div className="relative border-2 border-blue-600 p-6 rounded-lg shadow-md">
				{favorites.length === 0 ? (
					<p className="text-center text-gray-500">
						Aucune partition en favoris.
					</p>
				) : (
					<div className="space-y-4">
						{favorites.filter((partition) => partition).map((partition) => (

							<div key={partition.id} className="flex items-center justify-between border-b pb-2">
								<div className="flex items-center">
									<img
										alt={partition.title}
										className="w-12 h-12 rounded-md"
									/>
									<div className="ml-4">
										<h3 className="text-lg font-semibold">{partition.title}</h3>
										<p className="text-gray-600">{partition.booklet}</p>
										<p className="text-gray-600">{partition.author} - {partition.support}</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">

									<Section
										isFavoritePage={true}
										onUnfavorite={() => removeFromFavorites(partition.id)}
									/>
									<span className="text-lg font-semibold">{partition.price}€</span>
								</div>
							</div>

						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FavoritesPage;
