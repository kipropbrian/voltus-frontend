import axios from 'axios';

/**
 * Call the Face Detection API to detect faces in an image.
 *
 * @param {File} imageFile - The image file to be uploaded for face detection.
 * @param {string} baseUrl - The base API URL.
 * @returns {Object} The response data from the Face Detection API.
 */
export async function detectFace(imageFile, baseUrl) {
	const form = new FormData();
	form.append('image', imageFile, imageFile.name);

	const config = {
		headers: {
			'content-type': 'multipart/form-data',
			accept: 'application/json',
		},
	};

	const response = await axios.post(`${baseUrl}/api/face/detect`, form, config);
	return response.data;
}

/**
 * Call the Face Search API to search for faces in a FaceSet.
 *
 * @param {string} faceToken - The token of the detected face.
 * @param {string} faceSetToken - The token of the FaceSet.
 * @param {string} baseUrl - The base API URL.
 * @returns {Object} The response data from the Face Search API.
 */
export async function searchFace(faceToken, faceSetToken, baseUrl) {
	const response = await axios.post(`${baseUrl}/api/face/search`, {
		face_token: faceToken,
		faceset_token: faceSetToken,
	});
	return response.data;
}

/**
 * Processes the detected faces and matches them with known persons using `user_id` or marks them as unknown.
 *
 * @param {Object} info - The `info` object from the API response, containing persons and facepResponse.
 * @returns {Array} processedFaces - Array of processed faces.
 */
export function processFaces(info) {
	const { faces, results } = info.facepResponse;

	const processedFaces = faces.map((face) => {
		// Find a match between the face and results based on user_id, not face_token
		const match = results.find((result) => result.user_id);

		// If a match is found, associate with the person and confidence
		if (match) {
			const person = info.persons.find((p) => p.uuid === match.user_id);

			if (person) {
				return {
					...face,
					name: person.name,
					email: person.email,
					about: person.about,
					gender: person.gender,
					image_url: person.latest_image?.image_url,
					confidence: Math.floor(match.confidence), // Round confidence using Math.floor
				};
			}
		}

		// If no match, return an unknown individual
		return {
			...face,
			name: 'Unknown',
			email: null,
			about: 'No matching person found',
			gender: null,
			image_url: '/blank-person-612x612.jpeg',
			confidence: null,
		};
	});

	return processedFaces;
}
