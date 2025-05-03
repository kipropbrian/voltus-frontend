import { defineStore } from 'pinia';
import { useAlertStore } from '../stores/alertStore';
import { detectFace, searchFace, processFaces, addFaceToFaceset } from '../helpers/faceplusHandler'; // Import helpers
import { checkSize, updateImage, drawFaceRectangle, dropHandler } from '../helpers/imageHandler';
import axios from 'axios';

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
				alertStore.error('Failed to add face:');
			}
		},

		async submitImage() {
			const alertStore = useAlertStore();
			this.status.loading = true;

			if (!this.uploadedInfo.uploadedImage) {
				alertStore.error('Please select an image.');
				this.status.loading = false;
				return;
			}

			// Check if the image size is valid
			if (!checkSize(this.uploadedInfo.uploadedImage)) {
				alertStore.error('The uploaded image exceeds the maximum size of 2MB. Please upload a smaller file.');
				this.status.loading = false;
				return;
			}

			const formData = new FormData();
			formData.append('image', this.uploadedInfo.uploadedImage);

			try {
				const response = await axios.post(`${baseUrl}/api/image/search`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});

				this.correlationId = response.data.correlationId;
				alertStore.success('Image uploaded successfully');

				// Start polling for results
				const result = await this.pollForImageProcessing(this.correlationId);
				if (result) {
					this.processResults(result);
				}
			} catch (error) {
				console.error('Error submitting image:', error);
				alertStore.error(error.response?.data?.error || 'Failed to upload image for processing.');
			} finally {
				this.status.loading = false;
			}
		},

		/**
		 * Polls the server for the status of image processing until it is completed.
		 *
		 * @param {string} correlationId - The correlation ID to track the specific image processing request
		 * @param {number} [retryCount=0] - The current retry count, defaults to 0
		 * @param {number} [maxRetries=5] - The maximum number of retries before stopping
		 * @param {number} [interval=2000] - The interval in milliseconds between polling attempts
		 * @returns {Promise<Object|null>} - Resolves with the search results data if completed
		 */
		async pollForImageProcessing(correlationId, retryCount = 0, maxRetries = 5, interval = 3000) {
			const alertStore = useAlertStore();
			this.status.loading = true;

			if (retryCount >= maxRetries) {
				this.status.loading = false;
				alertStore.error('Image processing timeout reached');
				return null;
			}

			try {
				const response = await fetch(`${baseUrl}/api/image/search-results/${correlationId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				});

				const data = await response.json();

				// Status 200 means processing is complete
				if (response.status === 200) {
					alertStore.success('Image processing completed');
					this.status.loading = false;
					return data;
				}

				// Status 202 means processing is still in progress
				if (response.status === 202) {
					// alertStore.info('Image processing in progress...');
					// Wait for interval duration
					await new Promise((resolve) => setTimeout(resolve, interval));
					// Recursive call with incremented retry count
					return this.pollForImageProcessing(correlationId, retryCount + 1, maxRetries, interval);
				}

				// Any other status is an error
				alertStore.error('Error polling for image processing');
				this.status.loading = false;
				return null;
			} catch (error) {
				alertStore.error('Error polling for image processing');
				this.status.loading = false;
				return null;
			}
		},

		reset() {
			this.faceStyles = {};
		},
	},
});
