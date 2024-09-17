import axios from 'axios';
import { defineStore } from 'pinia';
import { useAlertStore } from '@/stores/alertStore';

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
	}),

	actions: {
		async getAll() {
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
				this.person = this.people.find((item) => item.id == id) || {};

				// Check if the person's details are already loaded
				if (!this.person) {
					const response = await axios.get(`${baseUrl}/api/person/${id}`);
					return response.data;
				}
				return this.person;
			} catch (error) {
				alertStore.error('There was an issue with the request.', error.message);
				return null;
			}
		},
		// Add the new createPerson action to create a person record
		async createPerson(personData) {
			const alertStore = useAlertStore();
			try {
				// Post request to create a new person
				const response = await axios.post(`${baseUrl}/api/person`, personData);

				// Optionally, update local people list or person after creation
				this.people.push(response.data.person); // Add the newly created person to the store

				return response.data.person;
			} catch (error) {
				this.errors = error.response?.data || error.message;
				alertStore.error('There was an issue with the request.');
			}
		},
	},
});
