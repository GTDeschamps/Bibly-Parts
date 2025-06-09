"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import { ShoppingCart, Heart, Book } from "lucide-react";
import Link from "next/link";

const UserAccountPage = () => {
	const [userData, setUserData] = useState<any>(null);
	const [newDisplayName, setNewDisplayName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [confirmEmailPassword, setConfirmEmailPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [deletePassword, setDeletePassword] = useState("");
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Stocke temporairement la nouvelle URL Cloudinary non enregistrée en DB
	const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(null);
	const [savingPhoto, setSavingPhoto] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const token = getToken();
		const storedUser = localStorage.getItem("user");

		if (!token || !storedUser) {
			return router.push("/signup?mode=login");
		}

		try {
			const user = JSON.parse(storedUser);
			setUserData(user);
			setNewDisplayName(user.username || "");
			setNewEmail(user.email || "");
		} catch (error) {
			console.error("Failed to parse user data from localStorage", error);
			clearToken();
			router.push("/signup?mode=login");
		}
	}, [router]);

	const resetMessages = () => {
		setError("");
		setSuccess("");
	};

	const handleUsernameChange = async () => {
		resetMessages();
		if (!newDisplayName) return;

		try {
			const res = await fetch("http://localhost:5000/api/user/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({ username: newDisplayName }),
			});

			if (!res.ok) throw new Error("Erreur mise à jour nom");

			setSuccess("Nom d'utilisateur mis à jour !");
			const updatedUser = { ...userData, username: newDisplayName };
			setUserData(updatedUser);
			localStorage.setItem("user", JSON.stringify(updatedUser));
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleEmailChange = async () => {
		resetMessages();
		if (!newEmail || !confirmEmailPassword) {
			setError("Email et mot de passe requis.");
			return;
		}

		try {
			const res = await fetch("http://localhost:5000/api/user/update-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({
					new_email: newEmail,
					password: confirmEmailPassword,
				}),
			});

			if (!res.ok) throw new Error("Erreur mise à jour e-mail");

			setSuccess("Email mis à jour !");
			setConfirmEmailPassword("");
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handlePasswordChange = async () => {
		resetMessages();
		if (newPassword !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		try {
			const res = await fetch("http://localhost:5000/api/user/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({ password: newPassword }),
			});

			if (!res.ok) throw new Error("Erreur mise à jour mot de passe");

			setSuccess("Mot de passe mis à jour !");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		resetMessages();
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
			if (!data.secure_url) throw new Error("Échec upload image");

			// Ici on ne met pas directement à jour la DB, juste on stocke la nouvelle URL en attente
			setPendingProfileImage(data.secure_url);
			setSuccess("Image uploadée. Pensez à enregistrer.");
		} catch (err: any) {
			setError("Erreur lors de l'upload.");
		} finally {
			setUploading(false);
		}
	};

	const handleSavePhoto = async () => {
		if (!pendingProfileImage) return;

		resetMessages();
		setSavingPhoto(true);

		try {
			const res = await fetch("http://localhost:5000/api/user/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({ profile_image: pendingProfileImage }),
			});

			if (!res.ok) throw new Error("Échec mise à jour photo");

			const updatedUser = { ...userData, profile_image: pendingProfileImage };
			setUserData(updatedUser);
			localStorage.setItem("user", JSON.stringify(updatedUser));
			setPendingProfileImage(null);
			setSuccess("Image de profil mise à jour !");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setSavingPhoto(false);
		}
	};

	const handleDeleteAccount = async () => {
		resetMessages();
		if (!deletePassword) {
			setError("Veuillez entrer votre mot de passe.");
			return;
		}

		const confirmed = window.confirm("Confirmer suppression du compte ?");
		if (!confirmed) return;

		try {
			const res = await fetch("http://localhost:5000/api/user/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({ password: deletePassword }),
			});

			if (!res.ok) throw new Error("Erreur suppression de compte");

			clearToken();
			router.push("/signup?mode=login");
		} catch (err: any) {
			setError(err.message);
		}
	};

	if (!userData) {
		return <div className="text-center mt-10 text-xl">Chargement des données...</div>;
	}

	return (
		<div className="min-h-screen bg-[#f5f5dc] p-6 flex flex-col items-center space-y-8">
			{/* PHOTO DE PROFIL */}
			<div className="relative flex flex-col items-center">
				<img
					src={pendingProfileImage || userData.profile_image || "/default-avatar.png"}
					alt="Profil"
					className="w-32 h-32 rounded-full object-cover shadow-md"
				/>
				<label className="mt-2 text-blue-700 hover:text-orange-500 cursor-pointer">
					Modifier la photo
					<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
				</label>
				{uploading && <p className="text-sm text-gray-500 mt-1">Upload en cours...</p>}

				{/* Bouton enregistrer uniquement si une nouvelle photo uploadée */}
				{pendingProfileImage && (
					<button
						onClick={handleSavePhoto}
						disabled={savingPhoto}
						className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
					>
						{savingPhoto ? "Enregistrement..." : "Enregistrer la photo"}
					</button>
				)}
			</div>

			{/* INFOS */}
			<div className="space-y-6 w-full max-w-xl">
				{/* Pseudo */}
				<div className="space-y-2">
					<label className="block font-semibold">Nom d'utilisateur</label>
					<input
						type="text"
						value={newDisplayName}
						onChange={(e) => setNewDisplayName(e.target.value)}
						className="w-full p-2 border border-blue-600 rounded-md"
					/>
					<button
						onClick={handleUsernameChange}
						className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500"
					>
						Modifier le nom
					</button>
				</div>

				{/* Email */}
				<div className="space-y-2">
					<label className="block font-semibold">Adresse e-mail</label>
					<input
						type="email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						className="w-full p-2 border border-blue-600 rounded-md"
					/>
					<input
						type="password"
						value={confirmEmailPassword}
						onChange={(e) => setConfirmEmailPassword(e.target.value)}
						placeholder="Mot de passe pour confirmer"
						className="w-full p-2 border border-blue-600 rounded-md"
					/>
					<button
						onClick={handleEmailChange}
						className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500"
					>
						Modifier l'email
					</button>
				</div>

				{/* Mot de passe */}
				<div className="space-y-2">
					<label className="block font-semibold">Nouveau mot de passe</label>
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="w-full p-2 border border-blue-600 rounded-md"
					/>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirmer le mot de passe"
						className="w-full p-2 border border-blue-600 rounded-md"
					/>
					<button
						onClick={handlePasswordChange}
						className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500"
					>
						Modifier le mot de passe
					</button>
				</div>

				{/* Suppression du compte */}
				<div className="space-y-2 border-t border-blue-600 pt-4">
					<label className="block font-semibold text-red-700">Supprimer le compte</label>
					<input
						type="password"
						value={deletePassword}
						onChange={(e) => setDeletePassword(e.target.value)}
						placeholder="Entrez votre mot de passe"
						className="w-full p-2 border border-red-600 rounded-md"
					/>
					<button
						onClick={handleDeleteAccount}
						className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900"
					>
						Supprimer le compte
					</button>
				</div>

				{/* Messages */}
				{error && <p className="text-red-600 font-semibold">{error}</p>}
				{success && <p className="text-green-600 font-semibold">{success}</p>}

				{/* Liens bas de page */}
				<div className="flex justify-center space-x-8 mt-8">
					<Link href="/favorites" className="flex items-center space-x-1 text-blue-700 hover:text-orange-500">
						<Heart />
						<span>Favoris</span>
					</Link>
					<Link href="/cart" className="flex items-center space-x-1 text-blue-700 hover:text-orange-500">
						<ShoppingCart />
						<span>Panier</span>
					</Link>
					<Link href="/history" className="flex items-center space-x-1 text-blue-700 hover:text-orange-500">
						<Book />
						<span>commande</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default UserAccountPage;
