"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, Heart, Filter, Search, Menu, X } from "lucide-react";
import Link from "next/link";

interface UserData {
  id: string;
  username: string;  // on corrige en username car API renvoie "username"
  email: string;
  profile_image?: string;  // optionnel, tu peux afficher cette image si tu veux
}

const Header = () => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setLoadingUser(false);
  }, []);

  const handleLogout = () => {
    // simple suppression locale du token, pas de logout côté serveur pour JWT stateless
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setAccountMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#1f3a93] text-white shadow-md p-4 flex items-center justify-between z-50">
      <Link href="/welcome" className="flex items-center space-x-2">
        <img src="../media/logo_biblyparts.png" alt="BIBLY-PARTS Logo" className="h-20 invert" />
      </Link>

      <div className="flex-grow mx-4 relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Recherche"
          className="w-full pl-10 pr-4 py-2 rounded-lg text-black focus:outline-none shadow-inner"
        />
      </div>

      <button className="md:hidden" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

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

        <div className="relative flex flex-col items-center" ref={menuRef}>
          {isLoggedIn && user ? (
            <>
              <button
                onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
                className="hover:text-[#ff6100] transition-transform transform hover:scale-105"
              >
                <User size={28} className="shadow-md" />
              </button>
              <span className="text-sm truncate max-w-[100px]" title={user.username}>
                {user.username}
              </span>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-100 text-black rounded-lg shadow-lg py-2">
                  <Link href="/useraccount" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setAccountMenuOpen(false)}>
                    Mon compte
                  </Link>
                  <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200 text-left">
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
                disabled={loadingUser}
              >
                <User size={28} className="shadow-md" />
              </button>
              <span className="text-sm">{loadingUser ? "..." : "Compte"}</span>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-100 text-black rounded-lg shadow-lg py-2">
                  <Link href="/signup" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setAccountMenuOpen(false)}>
                    Signup
                  </Link>
                  <Link href="/signup?mode=login" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setAccountMenuOpen(false)}>
                    Login
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
          {isLoggedIn && user ? (
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
