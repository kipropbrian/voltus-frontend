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

	const response = await axios.post(`${baseUrl}/api/face/fullsearch`, form, config);
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
 * Processes the detected faces and matches them with known persons or marks them as unknown.
 * Maps face data and search results into a simplified structure for easier frontend handling.
 * @param {Array} searchResults - Array of search results from the backend response.
 * @returns {Array} processedFaces - Array of processed face data for display.
 */
export function processFaces(searchResults) {
	return searchResults.map((result) => {
		const person = result.person_data.length ? result.person_data[0] : null;
		return {
			face_token: result.face_token,
			name: person ? person.name : 'Unknown',
			email: person ? person.email : null,
			about: person ? person.about : 'No matching person found',
			gender: person ? person.gender : null,
			image_url: person ? person.latest_image.image_url : '/blank-person-612x612.jpeg',
			confidence: Math.floor(result.confidence),
			face_rectangle: result.face_rectangle,
		};
	});
}