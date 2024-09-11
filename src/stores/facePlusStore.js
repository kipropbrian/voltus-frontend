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

						const results = await axios.post(uploadUrl, form, config);
						console.log('jere', results);

						// Check if the response contains an error, such as AUTHENTICATION_ERROR
						if (results.data.error_message) {
							// Display the error message from the API
							alertStore.error(`There was an issue with the request.`);
							this.status.loading = false;
							return; // Stop further processing if there's an error
						}

						// Check if the response contains an error, such as AUTHENTICATION_ERROR
						if (!results.data) {
							// Display the error message from the API
							alertStore.error(`There was an issue with the request!`);
							this.status.loading = false;
							return; // Stop further processing if there's an error
						}

						alertStore.success(results.data.message);

						// Update store state with response
						this.facePlusData = {
							persons: results.data.info.persons,
							facepResponse: {
								results: results.data.info.facepResponse.results, // Array of results
								faces: results.data.info.facepResponse.faces, // All detected faces
							},
							imageuuids: results.data.info.imageuuids,
						};

						// Process face matching
						this.processFaces();

						this.status.loading = false;
					} catch (e) {
						console.log('d', e);
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

		// Function to match persons and confidence with detected faces
		processFaces() {
			const { faces, results } = this.facePlusData.facepResponse;

			this.processedFaces = faces.map((face) => {
				// Find a match between the face and results
				const match = results.find((result) => result.face_token === face.face_token);

				// If a match is found, associate with the person and confidence
				if (match) {
					const person = this.facePlusData.persons.find((p) => p.uuid === match.user_id);

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
		},
	},
});
