"use client";

import React, { useState } from "react";
import { Menu, X, ShoppingCart, Eye, Heart, Play } from "lucide-react";

interface Partition {
  id: number;
  image: string;
  title: string;
  album: string;
  author: string;
  price: string;
}

interface SectionProps {
  title: string;
  partitions: Partition[];
}

const Section: React.FC<SectionProps> = ({ title, partitions }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  return (
    <div className="border-[#1f3a93] border-2 rounded-lg bg-gray-300 bg-opacity-50 p-4 my-6">
      <h2 className="text-xl font-bold text-[#1f3a93] mb-4">{title}</h2>

      <div className="space-y-2">
        {partitions.map((partition) => (
          <div
            key={partition.id}
            className="flex items-center justify-between bg-gray-200 bg-opacity-50 p-2 rounded-lg shadow-md"
          >
            {/* Vignette */}
            <img
              src={partition.image}
              alt={partition.title}
              className="w-16 h-16 object-cover rounded-lg"
            />

            {/* Infos */}
            <div className="flex-1 ml-4">
              <p className="text-lg font-semibold">{partition.title}</p>
              <p className="text-sm text-gray-600">{partition.album} - {partition.author}</p>
            </div>

            {/* Boutons Desktop */}
            <div className="hidden md:flex space-x-3">
              {[
                { icon: Play, label: "Jouer" },
                { icon: Eye, label: "Voir" },
                { icon: Heart, label: "Favori" },
                { icon: ShoppingCart, label: partition.price },
              ].map(({ icon: Icon, label }, index) => (
                <button
                  key={index}
                  className="text-[#1f3a93] hover:text-[#ff6100] transform transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 flex items-center"
                >
                  <Icon size={20} />
                  {label !== "Jouer" && label !== "Voir" && (
                    <span className="ml-1">{label}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Menu burger pour mobile */}
            <div className="md:hidden">
              <button onClick={() => setOpenDropdown(openDropdown === partition.id ? null : partition.id)}>
                {openDropdown === partition.id ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dropdown Mobile */}
      {openDropdown !== null && (
        <div className="md:hidden mt-2 bg-gray-200 bg-opacity-50 p-2 rounded-lg shadow-md flex flex-col items-center space-y-2">
          {[
            { icon: Play, label: "Jouer" },
            { icon: Eye, label: "Voir" },
            { icon: Heart, label: "Favori" },
            { icon: ShoppingCart, label: partitions.find(p => p.id === openDropdown)?.price },
          ].map(({ icon: Icon, label }, index) => (
            <button
              key={index}
              className="text-[#1f3a93] hover:text-[#ff6100] transform transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 flex items-center"
            >
              <Icon size={24} />
              <span className="ml-2">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Section;
