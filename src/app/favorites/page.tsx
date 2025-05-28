"use client";

import React, { useState, useEffect } from "react";
import Section from "../component/Section";
import { fetchFavorites } from "@/lib/FirebaseIntegration";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";

const FavoritesPage: React.FC = () => {
	const [favorites, setFavorites] = useState<any[]>([]);
	const [userId, setUserId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const db = getFirestore();

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUserId(user.uid);
				const favs = await fetchFavorites(user.uid);
				setFavorites(favs.reverse()); // facultatif : pour garder l'ordre
			} else {
				setFavorites([]);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const handleRemoveFromFavorites = async (id: string) => {
		if (!userId) return;

		try {
			const favRef = doc(db, `users/${userId}/favorites`, id);
			await deleteDoc(favRef);
			setFavorites(prev => prev.filter(p => p.id !== id));
			console.log("❌ Favori supprimé");
		} catch (err) {
			console.error("Erreur suppression Firestore:", err);
		}
	};

	return (
		<div className="bg-[#f5f5dc] min-h-screen p-8">
			<div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
				style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>

			<h1 className="text-xl font-bold text-center mb-6">Mes Partitions Favorites</h1>

			<div className="relative border-2 border-blue-600 p-6 rounded-lg shadow-md">
				{loading ? (
					<p className="text-center text-blue-800">Chargement...</p>
				) : favorites.length === 0 ? (
					<p className="text-center text-gray-500">Aucune partition en favoris.</p>
				) : (
					<div className="space-y-4">
						{favorites.map((item) => (
								<Section
									key={item.id}
									id={item.id}
									Cover={item.Cover}
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
