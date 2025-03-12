"use client";

import React, { useState, useEffect } from "react";
import Section from "../component/Section";

interface Partition {
	id: number;
	image: string;
	title: string;
	album: string;
	author: string;
	type: string;
	price: number;
}

const FavoritesPage: React.FC = () => {
	const [favorites, setFavorites] = useState<Partition[]>([]);

	// Charger les favoris depuis localStorage si l'utilisateur est connecté
	useEffect(() => {
	  const storedFavorites = localStorage.getItem("favorites");
	  if (storedFavorites) {
		setFavorites(JSON.parse(storedFavorites));
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
						{favorites.map((partition) => (
							<div key={partition.id} className="flex items-center justify-between border-b pb-2">
								<div className="flex items-center">
									<img
										src={partition.image}
										alt={partition.title}
										className="w-12 h-12 rounded-md"
									/>
									<div className="ml-4">
										<h3 className="text-lg font-semibold">{partition.title}</h3>
										<p className="text-gray-600">{partition.album}</p>
										<p className="text-gray-600">{partition.author} - {partition.type}</p>
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
