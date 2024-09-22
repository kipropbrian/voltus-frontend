export async function sanitizeTags(tags) {
	return tags
		.split(',')
		.map((tag) => tag.trim()) // Trim whitespace around each tag
		.filter((tag) => tag.length > 0) // Remove empty tags caused by trailing commas
		.join(','); // Rebuild the string without extra commas
}
