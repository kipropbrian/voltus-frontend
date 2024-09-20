import axios from 'axios';
import { defineStore } from 'pinia';
import { useAlertStore } from '@/stores/alertStore';
import { updateImage } from '@/helpers/imageHandler';

const baseUrl = import.meta.env.VITE_API_URL;
/**
 *
 * Store dealing with politicians and other people of interest.
 */
export const usePeopleStore = defineStore('people_store', {
	state: () => ({
		people: {},
		person: {},
		isSubmitting: false,
		submitted: false,
		newFormData: {
			name: '',
			gender: '',
			details: '',
			file: null, // To hold the file input
		},
		errors: null,
	}),

	actions: {
		uploadHandler(e) {
			this.newFormData.file = e.target.files[0];
		},
		async getAll() {
			const alertStore = useAlertStore();
			try {
				//move to helper
				const resp = await axios.get(`${baseUrl}/api/person`);
				this.people = resp.data.people;
			} catch (error) {
				alertStore.error('There was an issue with the request.', error.message);
			}
		},
		async getPersonById(id) {
			const alertStore = useAlertStore();
			try {
				// Find the person with the matching id
				if (this.people.length) {
					this.person = this.people.find((item) => item.id == id) || {};
				}
				// Check if the person's details are already loaded
				if (!this.person.length) {
					const response = await axios.get(`${baseUrl}/api/person/${id}`);
					this.person = response.data.person;
				}
				return this.person;
			} catch (error) {
				alertStore.error('There was an issue with the request.', error.message);
				return null;
			}
		},
		// Add the new createPerson action to create a person record
		async createPerson() {
			const alertStore = useAlertStore();
			try {
				this.isSubmitting = true;
				const formData = new FormData();
				formData.append('name', this.newFormData.name);
				formData.append('gender', this.newFormData.gender);
				formData.append('about', this.newFormData.details);
				if (this.newFormData.file) {
					formData.append('image', this.newFormData.file);
				}
				// Post request to create a new person
				const response = await axios.post(`${baseUrl}/api/person`, formData);

				if (response.status === 201) {
					this.submitted = true;
					this.isSubmitting = false;
					this.clearFormData();
					alertStore.success(response.data.message);
				}
			} catch (error) {
				this.isSubmitting = false;
				this.errors = error.response?.data || error.message;
				alertStore.error(this.errors.error);
			}
		},
		// Method to delete a person
		async deletePerson(personId) {
			const alertStore = useAlertStore();
			try {
				// Make a DELETE request to the API
				await axios.delete(`${baseUrl}/api/person/${personId}`);
				// Update the list by refetching people after deletion
				await this.getAll();
				alertStore.success('Person deleted successfully');
			} catch (error) {
				alertStore.error(error.message);
			}
		},
		//probably will delete and move to backend
		async syncImageToPerson(image, person) {
			try {
				const imageSyncUrl = `${baseUrl}/api/image/sync`;
				await axios.post(imageSyncUrl, {
					imageId: image.id,
					personUuid: person.uuid,
				});
				console.log('sync succesful');
			} catch (error) {
				console.log('Error syncing ', error);
			}
		},
		clearFormData() {
			// Reset newFormData to its initial state
			this.newFormData = {
				name: '',
				gender: '',
				details: '',
				file: null,
			};
			this.isSubmitting = false;
		},
	},
});
