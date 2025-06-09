"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Section from "../component/Section";

const styles = ["Blues", "Musique Classique", "Hard-Rock", "Jazz", "Blues", "Ragtime", "New Age", "Folk", "Pop", "Chanson française", "Variété internationale"];
const instruments = ["Batterie", "Guitare", "Violon", "Flûte", "Trompette", "Piano", "Orchestre", "Chorale", "Harpe", "Saxophone", "Clarinette", "Accordéon", "Orgue", "Synthétiseur", "Basse", "Violoncelle", "clavecin"];
const supports = ["partition", "tablature"];

const FilterPage = () => {
  const [style, setStyle] = useState("");
  const [instrument, setInstrument] = useState("");
  const [support, setSupport] = useState("");
  const [keyword, setKeyword] = useState("");
  const [partitions, setPartitions] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Charger depuis ton API Flask
  useEffect(() => {
    const loadPartitions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/partitions");
        if (!res.ok) throw new Error("Erreur chargement partitions");
        const data = await res.json();
        console.log("✅ Données reçues de l'API :", data);

        setPartitions(data);
        const mapped = data.map((p: any) => ({
          id: p.id,
          Title: p.Title || p.title,
          Artiste: p.Artiste || p.artiste || "Artiste inconnu",
          Instrument: p.Instrument || p.instrument || "",
          Style: p.Style || p.style || "",
          Type: p.Type || p.type || "",
          Booklet: p.Booklet || p.booklet || "",
          Price: p.Price || p.price || 0,
          CoverImage: p.CoverImage || p.cover_image || p.Cover || "",
        }));

        setPartitions(mapped);
        setFilteredResults(mapped);

        setFilteredResults(data);
      } catch (err: any) {
        console.error("Erreur API partitions :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPartitions();
  }, []);

  // 🔎 Appliquer les filtres côté client
  useEffect(() => {
    let results = [...partitions];

    if (style) {
      results = results.filter((p) => p.Style?.toLowerCase() === style.toLowerCase());
    }
    if (instrument) {
      results = results.filter((p) => p.Instrument?.toLowerCase() === instrument.toLowerCase());
    }
    if (support) {
      results = results.filter((p) => p.Type?.toLowerCase() === support.toLowerCase());
    }
    if (keyword) {
      const kw = keyword.toLowerCase();
      results = results.filter((p) =>
        p.Title?.toLowerCase().includes(kw) ||
        p.Artiste?.toLowerCase().includes(kw) ||
        p.Booklet?.toLowerCase().includes(kw)
      );
    }

    setFilteredResults(results);
  }, [style, instrument, support, keyword, partitions]);

  if (loading) return <p className="text-center text-blue-900">Chargement...</p>;
  if (error) return <p className="text-center text-red-600">Erreur : {error}</p>;

  return (
    <div className="bg-[#f5f5dc] min-h-screen py-10 px-4 md:px-12 relative max-h-screen overflow-y-auto">
      {/* Filigrane */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
        style={{
          backgroundImage:
            "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
        }}
      ></div>

      <div className="relative p-6">
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            className="w-full p-3 border-2 border-blue-600 bg-gray-200 rounded-lg outline-none"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="">Style</option>
            {styles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="w-full p-3 border-2 border-blue-600 bg-gray-200 rounded-lg outline-none"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            <option value="">Instrument</option>
            {instruments.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>

          <select
            className="w-full p-3 border-2 border-blue-600 bg-gray-200 rounded-lg outline-none"
            value={support}
            onChange={(e) => setSupport(e.target.value)}
          >
            <option value="">Support</option>
            {supports.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

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
            filteredResults.map((item) => (
              <Section
                key={item.id}
                id={item.partition_id}
                Title={item.Title}
                Artiste={item.Artiste}
                Instrument={item.Instrument}
                Style={item.Style}
                Type={item.Type}
                Booklet={item.Booklet}
                Price={item.Price}
                Cover={item.CoverImage}
              />
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
