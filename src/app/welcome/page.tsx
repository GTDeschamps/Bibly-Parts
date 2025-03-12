"use client";

import { useState,useEffect } from "react";
import Section from "../component/Section";  // Importer votre composant Section

// Fonction utilitaire pour récupérer n éléments aléatoires d'un tableau
const getRandomItems = (array: any[], n: number) => {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
};

const WelcomePage = () => {
	const [featuredPartitions, setFeaturedPartitions] = useState([]);
	const [featuredTablatures, setFeaturedTablatures] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPartitions = async () => {
		  try {
			const response = await fetch("/PartitionData.json");
			if (!response.ok) throw new Error("Erreur lors du chargement des partitions");
			const data = await response.json();

			// Filtrer les partitions et tablatures
			const partitionList = data.filter((p: any) => p.support.toLowerCase() === "partition");
			const tablatureList = data.filter((p: any) => p.support.toLowerCase() === "tablature");

			// Sélectionner 3 éléments aléatoires dans chaque catégorie
			setFeaturedPartitions(getRandomItems(partitionList, 3));
			setFeaturedTablatures(getRandomItems(tablatureList, 3));
		  } catch (err: any) {
			setError(err.message);
		  } finally {
			setLoading(false);
		  }
		};

		fetchPartitions();
	  }, []);

	  if (loading) return <p className="text-center text-blue-900">Chargement...</p>;
	  if (error) return <p className="text-center text-red-600">Erreur : {error}</p>;

		return (
			<div className="bg-[#f5f5dc] min-h-screen py-10 px-4 md:px-12 relative max-h-screen overflow-y-auto">
				{/* Filigrane d'image */}
				<div
					className="absolute inset-0 bg-cover bg-center opacity-20"
					style={{
						backgroundImage:
							"url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
					}}
				></div>

				{/* Partition à la Une */}
				<div className="mb-8 border-2 border-blue-900 rounded-lg p-4">
					<h2 className="text-2xl font-bold text-blue-900 mb-4">
						Partition à la Une
					</h2>
					<div className="space-y-4">
						{featuredPartitions.map((partition) => (
							<Section
								key={partition.id}
								id={partition.id}
								title={partition.title}
								author={partition.author}
								support={partition.support}
								album={partition.album}
								price={partition.price}
							/>
						))}
					</div>
				</div>

				{/* Tablature à la Une */}
				<div className="mb-8 border-2 border-blue-900 rounded-lg p-4">
					<h2 className="text-2xl font-bold text-blue-900 mb-4">
						Tablature à la Une
					</h2>
					<div className="space-y-4">
						{featuredTablatures.map((tablature) => (
							<Section
								key={tablature.id}
								id={tablature.id}
								title={tablature.title}
								author={tablature.author}
								support={tablature.support}
								album={tablature.album}
								price={tablature.price}
							/>
						))}
					</div>
				</div>
			</div>
		);
	};

	export default WelcomePage;
