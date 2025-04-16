export const uploadImageToCloudinary = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", "Bibly-Parts");
	formData.append("cloud_name", "dz42jvvyj"); 
	formData.append("folder", "avatars");

	const res = await fetch("https://api.cloudinary.com/v1_1/dz42jvvyj/image/upload", {
	  method: "POST",
	  body: formData,
	});

	const data = await res.json();

	if (!res.ok) {
	  throw new Error(data.error?.message || "Erreur Cloudinary");
	}

	return data.secure_url;
  };
