"use client";

import React, { useState, useEffect } from "react";
import Section from "../component/Section";

const FavoritesPage: React.FC = () => {
	const [favorites, setFavorites] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchFavorites = async () => {
		try {
			const token = localStorage.getItem("token");
			console.log("Token:", token);
			if (!token) throw new Error("Utilisateur non authentifié");

			const res = await fetch("http://localhost:5000/api/favorites", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) throw new Error("Échec du chargement des favoris");

			const data = await res.json();
			setFavorites(data.reverse());
		} catch (err: any) {
			console.error("❌ Erreur chargement favoris :", err.message);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveFromFavorites = async (id: string) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("Utilisateur non authentifié");

			const res = await fetch(`http://localhost:5000/api/favorites/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) throw new Error("Erreur de suppression");

			setFavorites(prev => prev.filter(p => p.id !== id));
			console.log("❌ Favori supprimé");
		} catch (err: any) {
			console.error("Erreur suppression :", err.message);
		}
	};

	useEffect(() => {
		fetchFavorites();
	}, []);

	return (
		<div className="bg-[#f5f5dc] min-h-screen p-8">
			<div
				className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
				style={{
					backgroundImage:
						"url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
				}}
			></div>

			<h1 className="text-xl font-bold text-center mb-6">Mes Partitions Favorites</h1>

			<div className="relative border-2 border-blue-600 p-6 rounded-lg shadow-md">
				{loading ? (
					<p className="text-center text-blue-800">Chargement...</p>
				) : error ? (
					<p className="text-center text-red-500">{error}</p>
				) : favorites.length === 0 ? (
					<p className="text-center text-gray-500">Aucune partition en favoris.</p>
				) : (
					<div className="space-y-4">
						{favorites.map((item) => (
							<Section
								key={item.id}
								id={item.id}
								Cover={item.CoverImage}
								Title={item.Title}
								Artiste={item.Artiste}
								Instrument={item.Instrument}
								Style={item.Style}
								Type={item.Type}
								Booklet={item.Booklet}
								Price={item.Price}
								isFavoritePage={true}
								onUnfavorite={() => handleRemoveFromFavorites(item.id)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FavoritesPage;
