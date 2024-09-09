/**
 *
 * Store dealing with politicians and other people of interest.
 */

import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const usePeopleStore = defineStore('people_store', {
	state: () => ({
		people: {},
		errors: {},
		person: {}
	}),

	actions: {
		async getAll() {
			try {
				//move to helper
				const resp = await axios.get(`${baseUrl}/api/person`);
				this.people = resp.data.people;
			} catch (error) {
				this.errors = error.message;
			}
		},
		async getPersonById(id) {
			try {
				// Find the person with the matching id
				this.person = this.people.find(item => item.id == id) || {};

				// Check if the person's details are already loaded
				if (!this.person) {
					const response = await axios.get(`${baseUrl}/api/person/${id}`);
					return response.data;
				}
				return this.person;
			} catch (error) {
				this.errors = error.message;
				return null;
			}
		},
	},
});
