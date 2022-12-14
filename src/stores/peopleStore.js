import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const usePeopleStore = defineStore('people_store', {
	state: () => ({
		people: {},
		errors: {}
	}),

	actions: {
		async getAll() {
			try {
				const resp = await axios.get(`${baseUrl}/api/person`);
				this.people = resp.data.people;
			} catch (error) {
				this.errors = error.message;
			}
		},
	},
});
