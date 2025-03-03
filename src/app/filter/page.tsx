"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const styles = ["Rock", "Rap", "Classique", "Métal", "Pop", "Variété française", "Variété internationale"];
const instruments = ["Batterie", "Guitare", "Violon", "Flûte", "Trompette", "Piano", "Orchestre"];
const supports = ["Partition", "Tablature"];

const FilterPage = () => {
	const [style, setStyle] = useState("");
	const [instrument, setInstrument] = useState("");
	const [support, setSupport] = useState("");
	const [keyword, setKeyword] = useState("");

	const results = [
		{ title: "Sonate n°1", author: "Beethoven", support: "Partition" },
		{ title: "Concerto en ré", author: "Vivaldi", support: "Tablature" },
	];

	return (
		<div className="min-h-screen bg-[#f5f5dc] p-6 relative">
			<div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20" style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>

			<div className="relative p-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
					{/** Style Dropdown */}
					<div className="relative border-2 border-blue-600 bg-gray-200 rounded-lg">
						<select className="w-full p-2 bg-gray-200 outline-none" value={style} onChange={(e) => setStyle(e.target.value)}>
							<option value="">Style</option>
							{styles.map((s) => (
								<option key={s} value={s}>{s}</option>
							))}
						</select>
					</div>

					{/** Instrument Dropdown */}
					<div className="relative border-2 border-blue-600 bg-gray-200 rounded-lg">
						<select className="w-full p-2 bg-gray-200 outline-none" value={instrument} onChange={(e) => setInstrument(e.target.value)}>
							<option value="">Instrument</option>
							{instruments.map((i) => (
								<option key={i} value={i}>{i}</option>
							))}
						</select>
					</div>

					{/** Support Dropdown */}
					<div className="relative border-2 border-blue-600 bg-gray-200 rounded-lg">
						<select className="w-full p-2 bg-gray-200 outline-none" value={support} onChange={(e) => setSupport(e.target.value)}>
							<option value="">Support</option>
							{supports.map((s) => (
								<option key={s} value={s}>{s}</option>
							))}
						</select>

					</div>

					{/** Recherche */}
					<div className="relative flex items-center border-2 border-blue-600 bg-gray-200 rounded-lg">
						<Search size={18} className="ml-2 text-gray-500" />
						<input
							type="text"
							placeholder="Auteur / Compositeur / Livret / Titre"
							className="w-full p-2 outline-none bg-gray-200"
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					</div>
				</div>

				{/** Résultats */}
				<div className="mt-4 p-4 border-2 border-blue-600 bg-gray-200 rounded-lg">
					{results.length > 0 ? (
						results.map((item, index) => (
							<div key={index} className="border-b last:border-none py-2">
								<p className="text-lg font-semibold">{item.title}</p>
								<p className="text-gray-600">{item.author} - {item.support}</p>
							</div>
						))
					) : (
						<p className="text-gray-500">Aucun résultat trouvé</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default FilterPage;
