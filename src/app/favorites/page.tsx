"use client";

import React, { useState } from "react";
import { Play, FileText, Trash2, ShoppingCart } from "lucide-react";

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
	const [favorites, setFavorites] = useState<Partition[]>([
		{ id: 1, image: "/images/partition1.jpg", title: "Tourne les violons", album: "Chanson pour les pieds", author: "Jean-Jacques Goldman", type: "Partition", price: 12 },
		{ id: 2, image: "/images/partition2.jpg", title: "HygiaPhone", album: "Best Of", author: "Téléphone", type: "Tablature", price: 12 },
		{ id: 3, image: "/images/partition3.jpg", title: "Allumer le feu", album: "Ce que je sais", author: "Johnny Halliday", type: "Partition", price: 12 },
	]);

	const removeFromFavorites = (id: number) => {
		setFavorites(favorites.filter((partition) => partition.id !== id));
	};

	return (
		<div className="bg-[#f5f5dc] min-h-screen p-8">
			<h1 className="text-xl font-bold text-center mb-6">Mes Partitions Favorites</h1>
			<div className="bg-white p-6 rounded-lg shadow-md">
				{favorites.length === 0 ? (
					<p className="text-center text-gray-500">Aucune partition en favoris.</p>
				) : (
					<table className="w-full border-collapse">
						<tbody>
							{favorites.map((partition) => (
								<tr key={partition.id} className="border-b">
									<td className="p-2">
										<img src={partition.image} alt={partition.title} className="w-12 h-12" />
									</td>
									<td className="p-2 font-semibold">{partition.title}</td>
									<td className="p-2 text-gray-600">{partition.album}</td>
									<td className="p-2 text-gray-600">{partition.author}</td>
									<td className="p-2 text-gray-600">{partition.type}</td>
									<td className="p-2">
									<button className="p-2 rounded-full bg-blue-600 text-white hover:bg-orange-500">
                      <Play size={20} />
                    </button>
                  </td>
                  <td className="p-2">
                    <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-orange-500">
                      <FileText size={20} />
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-orange-500"
                      onClick={() => removeFromFavorites(partition.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                  <td className="p-2 flex items-center">
                    <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-orange-500 mr-2">
                      <ShoppingCart size={20} />
                    </button>
                    <span className="font-bold">{partition.price} €</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default FavoritesPage;
