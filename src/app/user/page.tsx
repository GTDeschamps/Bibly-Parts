import React from "react";

const UserAccount = () => {
	return (
		<div className="bg-beige min-h-screen flex justify-center items-center p-8 relative">
			<div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('../media/png-clipart-musical-notes-illustration-musical-note-sheet-music-music-therapy-music-notes-miscellaneous-angle-removebg-preview.png')" }}></div>
			<div className="bg-transparent p-6 w-full max-w-2xl relative">
				<div className="grid grid-cols-1 gap-6 place-items-center">
					<div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border border-blue-700">
						<span className="text-gray-600">image de compte</span>
					</div>
					<div className="w-full">
						<label className="block font-bold">Nom</label>
						<input type="text" className="w-full p-2 bg-gray-300 border border-blue-700 rounded-md" />

						<label className="block font-bold mt-4">Prénom</label>
						<input type="text" className="w-full p-2 bg-gray-300 border border-blue-700 rounded-md" />

						<label className="block font-bold mt-4">Adresse Mail</label>
						<input type="email" className="w-full p-2 bg-gray-300 border border-blue-700 rounded-md" />
					</div>
				</div>

				<div className="mt-6 flex justify-around text-blue-700 font-semibold underline">
					<a href="#">Mes Favoris</a>
					<a href="#">Historique de Commande</a>
					<a href="#">Panier</a>
				</div>
			</div>
		</div>
	);
};

export default UserAccount;
