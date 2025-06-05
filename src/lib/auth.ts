export const setToken = (token: string) => {
	console.log("Token sauvegardé :", token);
	localStorage.setItem("token", token);
};

export const getToken = () => {
	const token = localStorage.getItem("token");
	console.log("Token récupéré :", token);
	return token;
};

export const clearToken = () => {
	console.log("Token supprimé");
	localStorage.removeItem("token");
};
