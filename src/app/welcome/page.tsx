import React from "react";
import Section from "../component/Section";
import { Play, Eye, Heart, ShoppingCart, FileText, Menu } from "lucide-react";

const featuredPartitions = [
	{
		id: 1,
		image: "partition1.jpg",
		title: "Tourne les violons",
		album: "Chanson pour les pieds",
		author: "Jean-Jacques Goldman",
		price: "12€",
	},
	{
		id: 2,
		image: "partition2.jpg",
		title: "Hygiaphone",
		album: "Best Of",
		author: "Téléphone",
		price: "12€",
	},
	{
		id: 3,
		image: "partition3.jpg",
		title: "Allumer le feu",
		album: "Ce que je sais",
		author: "Johnny Hallyday",
		price: "12€",
	},
];

const welcomepage = () => {
	return (
		<div className="bg-[#f5f5dc] min-h-screen py-10 px-4 md:px-12 relative max-h-screen overflow-y-auto">
		  {/* Filigrane d'image */}
		  <div className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10" style={{ backgroundImage: "url('/filigrane.png')" }}></div>

		  <Section title="Partition à la Une" partitions={featuredPartitions} />
		  <Section title="Tablature à la Une" partitions={featuredPartitions} />
		</div>
	  );
	};

export default welcomepage;
