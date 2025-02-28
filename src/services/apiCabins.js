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
		query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
	}

	const { data, error } = await query.select();

	if (error) {
		if (error.code === "42501" && !id) {
			throw new Error("Test users are not allowed to create cabins");
		}

		throw new Error(`Cabin could not be ${id ? "updated" : "created"}`);
	}

	if (!data || data.length === 0) {
		throw new Error("Test users are not allowed to modify cabins");
	}

	// 2. Upload image
	if (hasImagePath) return data;
	const { error: storageError } = await supabase.storage
		.from("cabin-images")
		.upload(imageName, newCabin.image);

	// 3. Handle image upload failure
	if (storageError) {
		// Only rollback(delete) for CREATE, not EDIT
		if (!id && data && data[0]?.id) {
			await supabase.from("cabins").delete().eq("id", data[0].id);
			throw new Error(
				"Cabin image could not be uploaded, so the cabin was not created"
			);
		}
		// For EDIT, just report the upload failure
		throw new Error(
			"Cabin image could not be uploaded, cabin remains unchanged"
		);
	}

	return data;
}

export async function deleteCabin(id) {
	const { data, error } = await supabase
		.from("cabins")
		.delete()
		.eq("id", id)
		.select();

	if (error) {
		throw new Error("Cabin could not be deleted");
	}

	if (!data || data.length === 0) {
		throw new Error("Test users are not allowed to delete cabins");
	}
}
