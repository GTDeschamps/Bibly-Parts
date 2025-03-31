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
	console.log("favoris de la page favoris", favorites);

	// 	// Charger les favoris depuis localStorage si l'utilisateur est connecté
	useEffect(() => {
		const syncFavorites = () => {
			const storedFavorites = localStorage.getItem("favorites");
			if (storedFavorites) {
				try {
					const parsedFavorites = JSON.parse(storedFavorites);
					console.log("Données récupérées depuis localStorage :", parsedFavorites);
					setFavorites(parsedFavorites.reverse());
				} catch (error) {
					console.error("Erreur lors du parsing des favoris :", error);
					setFavorites([]);
				}
			} else {
				setFavorites([]);
			}
		};

		// 🔥 Exécuter immédiatement
		syncFavorites();

		// 🔥 Écouter les changements dans localStorage
		window.addEventListener("storage", syncFavorites);

		return () => {
			window.removeEventListener("storage", syncFavorites);
		};
	}, []);



	// 	// Supprimer un favori
	const handleRemoveFromFavorites = (id: string) => {
		console.log(`Suppression de l'élément avec ID : ${id}`);

		// Supprimer la partition des favoris
		const updatedFavorites = favorites.filter((partition) => partition.id !== Number(id));

		// Mettre à jour `localStorage`
		localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

		// Mettre à jour le state React
		setFavorites(updatedFavorites);

		// 🔥 Forcer la mise à jour de `Section.tsx`
		window.dispatchEvent(new Event("storage"));
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

									<Section
										id={partition.id.toString()}
										title={partition.title}
										author={partition.author}
										instrument={partition.instrument}
										style={partition.style}
										support={partition.support}
										booklet={partition.booklet}
										price={partition.price}
										isFavoritePage={true}
										onUnfavorite={() => handleRemoveFromFavorites(partition.id.toString())}
									/>

						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FavoritesPage;
