import { defineStore } from 'pinia';
import { useAlertStore } from '../stores/alertStore';
import { detectFace, searchFace, processFaces, addFaceToFaceset } from '../helpers/faceplusHandler'; // Import helpers
import { checkSize, updateImage, drawFaceRectangle, dropHandler } from '../helpers/imageHandler';

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
				persons: [],
				facepResponse: [],
				imageuuids: [],
			},
			status: { loading: false },
			processedFaces: [], // This will hold the processed face data for the view
		};
	},

	actions: {
		uploadHandler(e) {
			this.reset();
			this.uploadedInfo = updateImage(e);
		},
		dropHandle(e) {
			this.reset();
			let images = dropHandler(e);
			if (images !== null) {
				this.uploadedInfo = images;
			}
		},

		async detectFaces() {
			const alertStore = useAlertStore();
			this.status.loading = true;

			if (this.uploadedInfo.uploadedImage) {
				if (checkSize(this.uploadedInfo.uploadedImage)) {
					try {
						const response = await detectFace(this.uploadedInfo.uploadedImage, baseUrl); // Use helper

						if (response.error_message) {
							alertStore.error('There was an issue with the request.');
							this.status.loading = false;
							return;
						}

						alertStore.success(response.message);

						// Process the face matching and update processedFaces state
						const processedFaces = processFaces(response.searchResults);

						// Update store state with the received response
						this.facePlusData.facepResponse = response.searchResults;

						// Update processed faces in the state
						this.processedFaces = processedFaces;

						this.status.loading = false;

						this.faceStyles = drawFaceRectangle(response.searchResults);
					} catch (e) {
						alertStore.error(e.message);
						this.status.loading = false;
					}
				} else {
					alertStore.error(
						'The uploaded image exceeds the maximum size of 2MB. Please upload a smaller file.',
					);
					this.status.loading = false;
				}
			} else {
				alertStore.error('Please attach an image!');
				this.status.loading = false;
			}
		},

		// Additional searchFace action
		async searchForFace(faceToken, faceSetToken) {
			const alertStore = useAlertStore();
			this.status.loading = true;
			try {
				const response = await searchFace(faceToken, faceSetToken, baseUrl); // Use helper for search
				// Handle search response
				alertStore.success('Face search completed');
				return response;
			} catch (e) {
				alertStore.error(e.message);
				this.status.loading = false;
			}
		},
		/**
		 * Add face(s) to a faceset.
		 * @param {string} outer_id - The outer_id of the faceset.
		 * @param {string} face_token - Comma-separated face tokens.
		 */
		async handleAddFace(face_token, personId) {
			const alertStore = useAlertStore();
			try {
				const response = await addFaceToFaceset(face_token, personId, baseUrl);
				alertStore.success('Face added successfully:', response);
			} catch (error) {
				console.log(error);
				alertStore.error('Failed to add face:');
			}
		},
		reset() {
			this.faceStyles = {};
		},
	},
});
