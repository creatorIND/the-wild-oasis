import supabase, { supabaseUrl } from "./supabase";
import { sanitizeKey } from "../utils/helpers";

export async function getCabins() {
	const { data, error } = await supabase
		.from("cabins")
		.select("*")
		.order("created_at", { ascending: true });

	if (error) {
		throw new Error("Cabins could not be loaded");
	}

	return data;
}

export async function createEditCabin(newCabin, id) {
	const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

	// Only generate imageName if uploading a new image
	let imageName;
	if (!hasImagePath && newCabin.image.name) {
		const baseName = sanitizeKey(newCabin.image.name);
		imageName = `${Math.random()}-${baseName}`;
	}

	const newImageURL = hasImagePath
		? newCabin.image
		: `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
	const imagePath = newImageURL;

	// 1. Create/Edit
	let query = supabase.from("cabins");

	// A. CREATE
	if (!id) {
		query = query.insert([{ ...newCabin, image: imagePath }]);
	}

	// B. EDIT
	if (id) {
		query = query
			.update({ ...newCabin, image: imagePath })
			.eq("id", id)
			.select();
	}

	const { data, error } = await query.select();

	if (error) {
		throw new Error("Cabins could not be created");
	}

	// 2. Upload image
	if (hasImagePath) return data;
	const { error: storageError } = await supabase.storage
		.from("cabin-images")
		.upload(imageName, newCabin.image);

	// 3. Delete the cabin if there was an error uploading the image
	if (storageError) {
		await supabase.from("cabins").delete().eq("id", data.id);
		throw new Error(
			"Cabins image could not be uploaded, so the cabin is not created"
		);
	}

	return data;
}

export async function deleteCabin(id) {
	const { error } = await supabase.from("cabins").delete().eq("id", id);

	if (error) {
		throw new Error("Cabin could not be deleted");
	}
}
