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
				},
				imageuuids: [], // This will hold the image UUIDs
			},
			status: { loading: false },
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
			// Show loading status
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

						// Perform the API request
						const results = await axios.post(uploadUrl, form, config);

						// Handle the success response
						alertStore.success(results.data.message);

						// Apply Math.floor to the confidence values in the results array
						const roundedResults = results.data.info.facepResponse.results.map((result) => {
							return {
								...result,
								confidence: Math.floor(result.confidence), // Round confidence using Math.floor
							};
						});

						// Update store state with the modified response
						this.facePlusData = {
							persons: results.data.info.persons, // Array of persons
							facepResponse: {
								results: roundedResults, // Array of results with rounded confidence scores
							},
							imageuuids: results.data.info.imageuuids, // Array of image UUIDs
						};

						// Stop the loading indicator
						this.status.loading = false;

						// Optional: Draw the face rectangles on the image
						// this.faceStyles = drawFaceRectangle(results.data);

						console.log('Face detection response:', results.data.message);
					} catch (e) {
						// Handle errors
						alertStore.error(e.message);
						this.status.loading = false;
					}
				} else {
					// Handle the case where no image is uploaded
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
	},
});
