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
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const router = useRouter();

	const token = getToken();
	console.log("Token utilisé pour fetch :", token);


	// 🔐 Chargement des infos utilisateur
	useEffect(() => {
		const fetchUserData = async () => {
			const token = getToken();

			if (!token) {
				console.warn("Aucun token trouvé, redirection...");
				return router.push("/signup?mode=login");
			}

			try {
				const res = await fetch("http://localhost:5000/api/user/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) {
					throw new Error(`Erreur API: ${res.status}`);
				}

				const data = await res.json();

				setUserData(data);
				setNewDisplayName(data.username || "");
				setNewEmail(data.email || "");
			} catch (err: any) {
				console.error("Erreur lors de la récupération de l'utilisateur:", err.message);
				clearToken();
				router.push("/signup?mode=login");
			}
		};

		fetchUserData();
	}, [router]);

	const handleUsernameChange = async () => {
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

			if (!res.ok) throw new Error("Échec de mise à jour du nom");

			setSuccess("Nom d'utilisateur mis à jour !");
			setUserData((prev: any) => ({ ...prev, username: newDisplayName }));
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleEmailChange = async () => {
		if (!newEmail) return;

		try {
			const res = await fetch("http://localhost:5000/api/user/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({ email: newEmail }),
			});

			if (!res.ok) throw new Error("Erreur lors de la mise à jour de l'e-mail");

			setSuccess("Adresse email mise à jour !");
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handlePasswordChange = async () => {
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

			if (!res.ok) throw new Error("Erreur de mise à jour du mot de passe");

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
			if (!data.secure_url) throw new Error("Échec de l'upload");

			const updateRes = await fetch("http://localhost:5000/api/user/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify({ photoURL: data.secure_url }),
			});

			if (!updateRes.ok) throw new Error("Échec mise à jour de la photo");

			setUserData((prev: any) => ({ ...prev, photoURL: data.secure_url }));
			setSuccess("Image de profil mise à jour !");
		} catch (err: any) {
			setError("Erreur lors de l'upload de l'image.");
		} finally {
			setUploading(false);
		}
	};

	if (!userData) {
		return <div className="text-center mt-10 text-xl">Chargement des données...</div>;
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
					<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
				</label>
				{uploading && <p className="text-sm text-gray-500 mt-1">Upload en cours...</p>}
			</div>

			{/* INFOS UTILISATEUR */}
			<div className="space-y-6 w-full max-w-xl">
				{/* Nom */}
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
					<label className="block font-semibold">Changer l'adresse email</label>
					<input
						type="email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						className="w-full p-2 border border-blue-600 rounded-md"
					/>
					<button
						onClick={handleEmailChange}
						className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500"
					>
						Modifier l’e-mail
					</button>
				</div>

				{/* Password */}
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
						className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-orange-500"
					>
						Modifier le mot de passe
					</button>
				</div>

				{success && <p className="text-green-600 text-sm">{success}</p>}
				{error && <p className="text-red-600 text-sm">{error}</p>}
			</div>

			{/* Liens */}
			<div className="flex justify-center gap-6 pt-8">
				<Link href="/favorites" className="flex flex-col items-center hover:text-[#ff6100]">
					<Heart size={28} />
					<span className="text-sm">Favoris</span>
				</Link>
				<Link href="/cart" className="flex flex-col items-center hover:text-[#ff6100]">
					<ShoppingCart size={28} />
					<span className="text-sm">Panier</span>
				</Link>
				<Link href="/order" className="flex flex-col items-center hover:text-[#ff6100]">
					<Book size={28} />
					<span className="text-sm">Historique</span>
				</Link>
			</div>
		</div>
	);
};

export default UserAccountPage;
