import axios from 'axios';
import { defineStore } from 'pinia';
import { useAlertStore } from './alertStore';

const baseUrl = import.meta.env.VITE_API_URL;
/**
 *
 * Store dealing with politicians and other people of interest.
 */
export const usePeopleStore = defineStore('people_store', {
	state: () => ({
		people: [],
		person: {},
		faceStyles: {},
		isSubmitting: false,
		submitted: false,
		errors: null,
		totalPeople: 0,
	}),

	actions: {
		async getAll({ page = 1, pageSize = 10, search = null }) {
			const alertStore = useAlertStore();
			try {
				const params = {
					page,
					pageSize,
					search,
				};
				const resp = await axios.get(`${baseUrl}/api/person`, { params });
				this.people = resp.data.people;
				this.totalPeople = resp.data.total;
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
		async createPerson(formPayload) {
			const alertStore = useAlertStore();
			try {
				this.isSubmitting = true;
				const formData = new FormData();
				formData.append('name', formPayload.name);
				formData.append('gender', formPayload.gender);
				formData.append('about', formPayload.details);
				if (formPayload.file) {
					formData.append('image', formPayload.file);
				}
				// Post request to create a new person
				const response = await axios.post(`${baseUrl}/api/person`, formData);

				if (response.status === 201) {
					alertStore.success(response.data.message);
				}
			} catch (error) {
				this.errors = error.response?.data || error.message;
				alertStore.error(this.errors.error);
			}
		},
		// Add the new createPerson action to create a person record
		async updatePerson(personId, personData) {
			const alertStore = useAlertStore();
			try {
				// Add this line to override the method
				const editFormaData = new FormData();
				editFormaData.append('_method', 'PUT');

				editFormaData.append('name', personData.name);
				editFormaData.append('gender', personData.gender);
				editFormaData.append('about', personData.about);
				if (personData.file) {
					editFormaData.append('image', personData.file);
				}
				// Post request to create a new person
				const response = await axios.post(`${baseUrl}/api/person/${personId}`, editFormaData);

				if (response.status === 201) {
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
