import { defineStore } from 'pinia';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import { checkSize, updateImage, drawFaceRectangle, dropHandler } from '@/helpers/imageHandler';

const baseUrl = import.meta.env.VITE_API_URL;

export const useFacePlusStore = defineStore('facePlusStore', {
	state() {
		return {
			uploadedInfo: {
				imgurl: '/blank-person-612x612.jpeg',
				uploadedImage: null,
			},
			faceStyles: {},
			facePlusData: {
				persons: [], // This will hold persons data
				facepResponse: {
					results: [], // This will hold face match results including confidence
					faces: [], // This will hold all detected faces
				},
				imageuuids: [], // This will hold the image UUIDs
			},
			status: { loading: false },
			processedFaces: [], // This will hold the processed face data for the view
		};
	},
	actions: {
		uploadHandler(e) {
			this.uploadedInfo = updateImage(e);
		},
		dropHandle(e) {
			let images = dropHandler(e);
			if (images !== null) {
				this.uploadedInfo = images;
			}
		},

		async detectFaces() {
			const alertStore = useAlertStore();
			this.status.loading = true;

			const uploadUrl = `${baseUrl}/api/image/upload`;

			if (this.uploadedInfo.uploadedImage) {
				if (checkSize(this.uploadedInfo.uploadedImage)) {
					try {
						let form = new FormData();
						form.append('image', this.uploadedInfo.uploadedImage, this.uploadedInfo.uploadedImage.name);

						const config = {
							headers: {
								'content-type': 'multipart/form-data',
								accept: 'application/json',
							},
						};

						const response = await axios.post(uploadUrl, form, config);

						// Check if the response contains an error, such as AUTHENTICATION_ERROR
						if (response.data.error_message) {
							alertStore.error(`There was an issue with the request.`);
							this.status.loading = false;
							return;
						}

						alertStore.success(response.data.message);

						// Process the face matching and update processedFaces state
						const processedFaces = this.processFaces(response.data.info);

						// Update store state with the received response
						this.facePlusData = {
							persons: response.data.info.persons,
							facepResponse: {
								results: response.data.info.facepResponse.results,
								faces: response.data.info.facepResponse.faces,
							},
							imageuuids: response.data.info.imageuuids,
						};

						// Update processed faces in the state
						this.processedFaces = processedFaces;

						this.status.loading = false;
					} catch (e) {
						alertStore.error(e.message);
						this.status.loading = false;
					}
				} else {
					alertStore.error(
						'The uploaded image exceeds the maximum size of 2MB. Please upload a smaller file.'
					);
					this.status.loading = false;
				}
			} else {
				alertStore.error('Please attach an image!');
				this.status.loading = false;
			}
		},

		/**
		 * Processes the detected faces and matches them with known persons using `user_id` or marks them as unknown.
		 *
		 * This function iterates over the detected faces from the `facepResponse.faces` array and attempts
		 * to find a corresponding match in the `facepResponse.results` array based on the `user_id`.
		 *
		 * - If a match is found, it uses the `user_id` from the results to find the corresponding person
		 *   in the `persons` array. The person's details (name, email, about, gender, and image) and
		 *   confidence score are added to the processed face data.
		 * - If no match is found for a detected face, the face is marked as "Unknown" and assigned default
		 *   placeholder values (e.g., "No matching person found" and a placeholder image).
		 *
		 * The processed face data is returned and then stored in the `processedFaces` state.
		 *
		 * @param {Object} info - The `info` object from the API response, containing persons and facepResponse.
		 * @returns {Array} processedFaces - Array of processed faces.
		 */
		processFaces(info) {
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
		},
	},
});
