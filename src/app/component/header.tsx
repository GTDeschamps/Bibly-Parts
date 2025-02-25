'use client';

import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Heart, Filter, Search } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#1f3a93] text-white shadow-md p-4 flex items-center justify-between z-50">
      {/* Logo avec inversion des couleurs */}
      <Link href="/welcome" className="flex items-center space-x-2">
        <img src="../media/logo_biblyparts.png" alt="BIBLY-PARTS Logo" className="h-20 invert" />
      </Link>

      {/* Search Bar avec icône de loupe */}
      <div className="flex-grow mx-4 relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Recherche"
          className="w-full pl-10 pr-4 py-2 rounded-lg text-black focus:outline-none shadow-inner"
        />
      </div>

      {/* Navigation Icons avec intitulés */}
      <div className="flex items-center space-x-6">
        <Link href="/filter" className="flex flex-col items-center hover:text-[#ff6100] transition-transform transform hover:scale-105">
          <Filter size={28} className="shadow-md" />
          <span className="text-sm">Filtre</span>
        </Link>
        <Link href="/favorites" className="flex flex-col items-center hover:text-[#ff6100] transition-transform transform hover:scale-105">
          <Heart size={28} className="shadow-md" />
          <span className="text-sm">Favoris</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center hover:text-[#ff6100] transition-transform transform hover:scale-105">
          <ShoppingCart size={28} className="shadow-md" />
          <span className="text-sm">Panier</span>
        </Link>

        {/* Account Button avec intitulé */}
        <div className="relative flex flex-col items-center" ref={menuRef}>
          <button
            onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
            className="hover:text-[#ff6100] transition-transform transform hover:scale-105"
          >
            <User size={28} className="shadow-md" />
          </button>
          <span className="text-sm">Compte</span>
          {isAccountMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-100 text-black rounded-lg shadow-lg py-2">
              <Link href="/signup" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setAccountMenuOpen(false)}>Signup</Link>
              <Link href="/signup?mode=login" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setAccountMenuOpen(false)}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
