// Code: Filtres de recherche
"use client";
import { useState, useEffect } from "react";
import { Play, Info, Heart, ShoppingCart, FileText, Search, Menu } from "lucide-react";
import Section from "../component/Section";  // Importer votre composant Section


const styles = ["Rock", "Rap", "Classique", "Metal","Jazz","Blues","Ragtime","New Age","Folk", "Pop", "Variété française", "Variété internationale"];
const instruments = ["Batterie", "Guitare", "Violon", "Flûte", "Trompette", "Piano", "Orchestre", "Chorale", "Harpe", "Saxophone", "Clarinette", "Accordéon", "Orgue", "Synthétiseur", "Basse","Violoncelle"];
const supports = ["partition", "tablature"];

const FilterPage = () => {
	const [style, setStyle] = useState("");
	const [instrument, setInstrument] = useState("");
	const [support, setSupport] = useState("");
	const [keyword, setKeyword] = useState("");
	const [partitions, setPartitions] = useState([]); // Stocke toutes les partitions
	const [filteredResults, setFilteredResults] = useState([]); // Stocke les résultats filtrés
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false); // Pour gérer le menu burger

 // Charger les partitions depuis le fichier JSON
 useEffect(() => {
    const fetchPartitions = async () => {
      try {
        const response = await fetch("/PartitionData.json");
        if (!response.ok) throw new Error("Erreur lors du chargement des partitions");
        const data = await response.json();
        setPartitions(data); // Stocke toutes les partitions
        setFilteredResults(data); // Initialise avec toutes les partitions
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartitions();
  }, []);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let results = partitions;

    if (style) {
      results = results.filter((p: any) => p.style.toLowerCase() === style.toLowerCase());
    }

    if (instrument) {
      results = results.filter((p: any) => p.instrument.toLowerCase() === instrument.toLowerCase());
    }

    if (support) {
      results = results.filter((p: any) => p.support.toLowerCase() === support.toLowerCase());
    }

    if (keyword) {
      results = results.filter((p: any) =>
        p.title.toLowerCase().includes(keyword.toLowerCase()) ||
        p.author.toLowerCase().includes(keyword.toLowerCase()) ||
        p.album.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredResults(results);
  }, [style, instrument, support, keyword, partitions]);

  if (loading) return <p className="text-center text-blue-900">Chargement...</p>;
  if (error) return <p className="text-center text-red-600">Erreur : {error}</p>;


	return (
		<div className="min-h-screen bg-[#f5f5dc] p-6 relative">
			<div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20" style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>

			<div className="relative p-6">
				<div className="flex items-center justify-between mb-4 md:hidden">

				</div>

				{/* Contenu des filtres */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
					<div className="relative border-2 border-blue-600 bg-gray-200 rounded-lg">
						<select className="w-full p-3 bg-gray-200 outline-none" value={style} onChange={(e) => setStyle(e.target.value)}>
							<option value="">Style</option>
							{styles.map((s) => (
								<option key={s} value={s}>{s}</option>
							))}
						</select>
					</div>

					<div className="relative border-2 border-blue-600 bg-gray-200 rounded-lg">
						<select className="w-full p-3 bg-gray-200 outline-none" value={instrument} onChange={(e) => setInstrument(e.target.value)}>
							<option value="">Instrument</option>
							{instruments.map((i) => (
								<option key={i} value={i}>{i}</option>
							))}
						</select>
					</div>

					<div className="relative border-2 border-blue-600 bg-gray-200 rounded-lg">
						<select className="w-full p-3 bg-gray-200 outline-none" value={support} onChange={(e) => setSupport(e.target.value)}>
							<option value="">Support</option>
							{supports.map((s) => (
								<option key={s} value={s}>{s}</option>
							))}
						</select>
					</div>

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

				{/* Résultats */}
				<div className="mt-4 p-4 border-2 border-blue-600 rounded-lg">
					{filteredResults.length > 0 ? (
						filteredResults.map((item, index) => (
							<Section key={index} title={item.title} author={item.author} support={item.support} />
						))
					) : (
						<p className="text-gray-500">Aucun résultat trouvé</p>
					)}
				</div>
			</div>
		</div>
	);
}

	export default FilterPage;
