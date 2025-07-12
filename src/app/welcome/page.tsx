"use client";

import { useState, useEffect } from "react";
import Section from "../component/Section";

const getRandomItems = (array: any[], n: number) => {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
};

const WelcomePage = () => {
	const [featuredPartitions, setFeaturedPartitions] = useState<any[]>([]);
	const [featuredTablatures, setFeaturedTablatures] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadPartitionsFromAPI = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/partitions");
				const data = await response.json();
				console.log("📦 DONNÉES RECUES DE FLASK :", data);

				const getValidImage = (url: string) =>
					url && url.startsWith("http") ? url : "/logo.png";


				const normalized = data.map((p: any) => ({
					id: p.id,
					Title: p.title,
					Artiste: p.artiste,
					Instrument: p.instrument,
					Style: p.style,
					Type: p.type,
					Booklet: p.booklet,
					Price: p.price,
					AudioFile: p.audio_file,
					CoverImage: getValidImage(p.cover_image)
				}));

				const partitionList = normalized.filter((p) => p.Type?.toLowerCase() === "partition");
				const tablatureList = normalized.filter((p) => p.Type?.toLowerCase() === "tablature");

				console.log("🎯 Partitions filtrées :", partitionList);
				console.log("🎯 Tablatures filtrées :", tablatureList);

				setFeaturedPartitions(getRandomItems(partitionList, 3));
				setFeaturedTablatures(getRandomItems(tablatureList, 3));
			} catch (err: any) {
				console.error("Erreur de chargement :", err);
				setError(err.message || "Erreur de chargement des partitions");
			} finally {
				setLoading(false);
			}
		};

		loadPartitionsFromAPI();
	}, []);

	if (loading) return <p className="text-center text-blue-900">Chargement...</p>;
	if (error) return <p className="text-center text-red-600">Erreur : {error}</p>;

	return (
		<div className="bg-[#f5f5dc] min-h-screen py-10 px-4 md:px-12 relative max-h-screen overflow-y-auto">
			<div
				className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
				style={{
					backgroundImage:
						"url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
				}}
			></div>

			{/* Partition à la Une */}
			<div className="mb-8 border-2 border-blue-900 rounded-lg p-4">
				<h2 className="text-2xl font-bold text-blue-900 mb-4">Partition à la Une</h2>
				<div className="space-y-4">
					{featuredPartitions.map((item) => {
						console.log("partition à la une :", item);
						return (
							<Section
								key={item.id}
								id={item.id}
								Title={item.Title}
								Artiste={item.Artiste}
								Instrument={item.Instrument}
								Style={item.Style}
								Type={item.Type}
								Booklet={item.Booklet}
								Price={item.Price}
								Cover={item.CoverImage}
								Audio={item.AudioFile}
							/>
						);
					})}
				</div>
			</div>

			{/* Tablature à la Une */}
			<div className="mb-8 border-2 border-blue-900 rounded-lg p-4">
				<h2 className="text-2xl font-bold text-blue-900 mb-4">Tablature à la Une</h2>
				<div className="space-y-4">
					{featuredTablatures.map((item) => {
						console.log("Tablature à la une :", item);
						return (
							<Section
								key={item.id}
								id={item.id}
								Title={item.Title}
								Artiste={item.Artiste}
								Instrument={item.Instrument}
								Style={item.Style}
								Type={item.Type}
								Booklet={item.Booklet}
								Price={item.Price}
								Cover={item.CoverImage}
								Audio={item.AudioFile}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default WelcomePage;
