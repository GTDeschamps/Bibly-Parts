"use client";

import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Heart, Filter, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { onAuthStateChanged, signOut, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig'; // Assurez-vous d'utiliser votre fichier d'initialisation Firebase

const Header = () => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = getAuth(app); // On récupère l'auth en utilisant l'app Firebase initialisée
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoggedIn(true);
          setUserName(user.displayName || user.email || 'Utilisateur');
        } else {
          setIsLoggedIn(false);
          setUserName('');
        }
      });

      // Nettoyage de l'abonnement
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth);
    setIsLoggedIn(false);
    setUserName('');
  };

  // Gérer le clic en dehors du menu (qu'on soit connecté ou pas)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false); // Ferme le menu si le clic est à l'extérieur
      }
    };

    // Ajouter un écouteur d'événements pour détecter les clics extérieurs
    document.addEventListener('mousedown', handleClickOutside);

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // On l'ajoute une seule fois lors du montage du composant


  return (
    <header className="fixed top-0 left-0 w-full bg-[#1f3a93] text-white shadow-md p-4 flex items-center justify-between z-50">
      {/* Logo */}
      <Link href="/welcome" className="flex items-center space-x-2">
        <img src="../media/logo_biblyparts.png" alt="BIBLY-PARTS Logo" className="h-20 invert" />
      </Link>

      {/* Search Bar */}
      <div className="flex-grow mx-4 relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Recherche"
          className="w-full pl-10 pr-4 py-2 rounded-lg text-black focus:outline-none shadow-inner"
        />
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navigation Icons (Desktop) */}
      <div className="hidden md:flex items-center space-x-6">
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

        {/* Account Button */}
        <div className="relative flex flex-col items-center" ref={menuRef}>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
                className="hover:text-[#ff6100] transition-transform transform hover:scale-105"
              >
                <User size={28} className="shadow-md" />
              </button>
              <span className="text-sm">{userName}</span>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-100 text-black rounded-lg shadow-lg py-2">
                  <Link href="/user" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setAccountMenuOpen(false)}>Mon compte</Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setAccountMenuOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-200 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#1f3a93] text-white p-4 flex flex-col items-center space-y-4 md:hidden">
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
          {isLoggedIn ? (
            <Link href="/user" className="flex flex-col items-center hover:text-[#ff6100] transition-transform transform hover:scale-105">
              <User size={28} className="shadow-md" />
              <span className="text-sm">Compte</span>
            </Link>
          ) : (
            <button
              onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
              className="hover:text-[#ff6100] transition-transform transform hover:scale-105"
            >
              <User size={28} className="shadow-md" />
              <span className="text-sm">Compte</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
