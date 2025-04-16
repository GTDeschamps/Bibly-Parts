"use client";

import React, { useEffect, useState } from "react";
import { getAuth, updatePassword, updateEmail, updateProfile, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Book} from 'lucide-react';
import Link from 'next/link';

const UserAccountPage = () => {
  const auth = getAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [newDisplayName, setNewDisplayName] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signup?mode=login");
      } else {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setNewDisplayName(docSnap.data().displayName || "");
          setNewEmail(user.email || "");

        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Bibly-Parts");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dz42jvvyj/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.secure_url) throw new Error("Erreur lors de l'upload");

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: data.secure_url,
      });

      setUserData((prev: any) => ({
        ...prev,
        photoURL: data.secure_url,
      }));

      setSuccess("Image de profil mise à jour !");
    } catch (err) {
      setError("Erreur lors de l'upload d'image.");
    } finally {
      setUploading(false);
    }
  };
  const handleUsernameChange = async () => {
    if (!auth.currentUser || !newDisplayName) return;

    try {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      });

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: newDisplayName,
      });

      setUserData((prev: any) => ({
        ...prev,
        displayName: newDisplayName,
      }));

      setSuccess("Nom d'utilisateur mis à jour !");
    } catch (err: any) {
      setError("Erreur lors de la mise à jour du nom.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword || !auth.currentUser) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccess("Mot de passe mis à jour !");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailChange = async () => {
    if (!auth.currentUser || !newEmail || !passwordConfirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || "",
        passwordConfirm
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        email: newEmail,
      });

      setSuccess("Adresse email mise à jour !");
      setNewEmail("");
      setPasswordConfirm("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!userData) {
    return <div className="text-center mt-10 text-xl">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-beige p-6 flex flex-col items-center space-y-8">
      {/* PHOTO DE PROFIL */}
      <div className="relative flex flex-col items-center">
        <img
          src={userData.photoURL || "/default-avatar.png"}
          alt="Photo de profil"
          className="w-32 h-32 rounded-full object-cover shadow-md"
        />
        <label className="mt-2 text-blue-700 hover:text-orange-500 cursor-pointer">
          Modifier la photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        {uploading && <p className="text-sm text-gray-500 mt-1">Upload en cours...</p>}
      </div>

      {/* INFOS UTILISATEUR */}
      <div className="space-y-6 w-full max-w-xl">
        {/* Nom d'utilisateur */}
        <div className="space-y-2">
          <label className="block font-semibold">Nom d'utilisateur</label>
          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            className="w-full p-2 border border-blue-600 rounded-md"
            placeholder="Nom d'utilisateur"
          />
          <button
            onClick={handleUsernameChange}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500 transition"
          >
            Modifier le nom
          </button>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block font-semibold">Changer l’adresse email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 border border-blue-600 rounded-md"
            placeholder="Nouvel email"
          />
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full p-2 border border-blue-600 rounded-md"
            placeholder="Mot de passe actuel"
          />
          <button
            onClick={handleEmailChange}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500 transition"
          >
            Modifier l’email
          </button>
        </div>

        {/* Mot de passe */}
        <div className="space-y-2">
          <label className="block font-semibold">Changer le mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-blue-600 rounded-md"
            placeholder="Nouveau mot de passe"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-blue-600 rounded-md"
            placeholder="Confirmer le mot de passe"
          />
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500 transition"
          >
            Modifier le mot de passe
          </button>
        </div>

        {/* MESSAGES */}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {/* LIENS DE NAVIGATION */}
      <div className="flex justify-center gap-6 pt-8">
      <Link href="/favorites" className="flex flex-col items-center hover:text-[#ff6100] transition-transform transform hover:scale-105">
          <Heart size={28} />
          <span className="text-sm">Favoris</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center hover:text-[#ff6100] transition-transform transform hover:scale-105">
          <ShoppingCart size={28}/>
          <span className="text-sm">Panier</span>
        </Link>
        <Link href="/order" className="flex flex-col items-center hover:text-[#ff6100] transition-transform transform hover:scale-105">
          <Book size={28}/>
          <span className="text-sm">Historique</span>
        </Link>
      </div>
    </div>
  );
};

export default UserAccountPage;
