"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setToken } from "@/lib/auth"; // Crée ce fichier

const Signup = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const isLogin = searchParams?.get("mode") === "login";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			if (isLogin) {
				// Connexion via API Flask
				const res = await fetch("http://localhost:5000/api/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Erreur de connexion");

				setToken(data.access_token); // JWT
				router.push("/useraccount");

			} else {
				// Création de compte via API Flask
				if (password !== confirmPassword) {
					setError("Les mots de passe ne correspondent pas.");
					return;
				}

				const res = await fetch("http://localhost:5000/api/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password, username }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

				setToken(data.access_token); // JWT
				router.push("/useraccount");
			}
		} catch (err: any) {
			setError(err.message || "Une erreur est survenue.");
		}
	};

	return (
		<div className="relative min-h-screen flex justify-center items-center p-8 bg-beige">
			<div
				className="absolute inset-0 bg-cover bg-center opacity-20"
				style={{
					backgroundImage:
						"url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')",
				}}
			></div>

			<div className="relative z-10 p-6 w-full max-w-2xl">
				<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
					{isLogin ? "Connexion" : "Création de compte"}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{!isLogin && (
						<div>
							<label className="block text-gray-700">Nom de compte</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500"
								required
							/>
						</div>
					)}

					<div>
						<label className="block text-gray-700">Adresse Mail</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500"
							required
						/>
					</div>

					<div>
						<label className="block text-gray-700">Mot de Passe</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500"
							required
						/>
					</div>

					{!isLogin && (
						<div>
							<label className="block text-gray-700">Confirmer le Mot de passe</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full p-2 border border-blue-600 rounded-md focus:ring-2 focus:ring-orange-500"
								required
							/>
						</div>
					)}

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-700 text-white font-semibold rounded-md hover:bg-orange-500 transition duration-300"
					>
						{isLogin ? "Valider" : "Créer un compte"}
					</button>

					<p
						className="text-center text-blue-700 cursor-pointer hover:text-orange-500"
						onClick={() =>
							router.push(`/signup?mode=${isLogin ? "signup" : "login"}`)
						}
					>
						{isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
					</p>
				</form>
			</div>
		</div>
	);
};

export default Signup;
