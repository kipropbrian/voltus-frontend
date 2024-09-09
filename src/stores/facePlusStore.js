/**
 * Pinia store to deal with all data realated to facial recognition
 * detection, search, dimensions e.t.c
 *
 */

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
			facePlusData: {},
			status: { loading: false },
			persons: {},
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

		//cancel upload dialog box not handled
		async detectFaces() {
			const alertStore = useAlertStore();
			//Show loading status
			const uploadUrl = `${baseUrl}/api/image/upload`;
			if (this.uploadedInfo.uploadedImage && checkSize(this.uploadedInfo.uploadedImage)) {
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
					//TODO: Handle resp errors like 404,500 e.t.c
					alertStore.success(results.data.message);
					//TODO: Persist data in local storage https://github.com/prazdevs/pinia-plugin-persistedstate
					this.status.loading = false;
					this.facePlusData = results.data.info;
					this.persons = results.data.info.persons;
					console.log(results.data.message);
					// this.faceStyles = drawFaceRectangle(results.data);
				} catch (e) {
					//This will probably not catch 404,500 and other such errors
					alertStore.error(e.message);
				}
			} else {
				//make this an alert
				alertStore.error('Please attach an image!');
				this.status.value = { loading: false };
				console.log('No image provided');
			}
		},
	},
});
