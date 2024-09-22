import axios from 'axios';
import { defineStore } from 'pinia';
import { useAlertStore } from '@/stores/alertStore';

const baseUrl = import.meta.env.VITE_API_URL;

/**
 *
 * Store dealing with Face++ facesets.
 */
export const useFaceSetStore = defineStore('faceset_store', {
	state: () => ({
		facesets: [],
		faceset: {},
		isSubmitting: false,
		submitted: false,
		newFormData: {
			outer_id: '',
			display_name: '',
			tags: '',
			face_tokens: '', // To hold face tokens as a comma-separated string
		},
		errors: null,
		loading: true,
	}),

	actions: {
		/**
		 * Fetch all facesets from the API.
		 */
		async getAllFacesets() {
			const alertStore = useAlertStore();
			this.loading = true;
			try {
				const response = await axios.get(`${baseUrl}/api/faceset`);
				this.facesets = response.data.facesets || response.data;
				this.loading = false;
			} catch (error) {
				alertStore.error('There was an issue fetching the facesets.', error.message);
			}
		},

		/**
		 * Fetch a specific faceset by its outer_id.
		 * @param {string} outer_id - The outer_id of the faceset.
		 */
		async getFacesetByOuterId(outer_id) {
			const alertStore = useAlertStore();
			this.loading = true;
			try {
				const response = await axios.get(`${baseUrl}/api/faceset/${outer_id}`);
				this.faceset = response.data.faceset || response.data;
				this.loading = false;
			} catch (error) {
				this.loading = false;
				alertStore.error('There was an issue fetching the faceset.', error.message);
				return null;
			}
		},

		/**
		 * Create a new faceset.
		 */
		async createFaceset() {
			const alertStore = useAlertStore();
			try {
				this.isSubmitting = true;
				const formData = {
					outer_id: this.newFormData.outer_id,
					display_name: this.newFormData.display_name,
					tags: this.newFormData.tags,
				};
				// Post request to create a new faceset
				const response = await axios.post(`${baseUrl}/api/facesets`, formData);

				if (response.status === 200 || response.status === 201) {
					this.submitted = true;
					this.isSubmitting = false;
					this.clearFormData();
					alertStore.success('Faceset created successfully');
					// Optionally fetch the updated list
					await this.getAllFacesets();
				}
			} catch (error) {
				this.isSubmitting = false;
				this.errors = error.response?.data || error.message;
				alertStore.error(this.errors.error || 'Failed to create faceset');
			}
		},

		/**
		 * Update an existing faceset.
		 * @param {string} outer_id - The outer_id of the faceset to update.
		 */
		async updateFaceset(outer_id) {
			const alertStore = useAlertStore();
			try {
				this.isSubmitting = true;

				// PUT request to update the faceset
				const response = await axios.put(`${baseUrl}/api/faceset/${outer_id}`, this.faceset);

				if (response.status === 200) {
					this.submitted = true;
					this.isSubmitting = false;

					alertStore.success('Faceset updated successfully');
					// Optionally fetch the updated list
					await this.getAllFacesets();
				}
			} catch (error) {
				this.isSubmitting = false;
				this.errors = error.response?.data || error.message;
				alertStore.error(this.errors.error || 'Failed to update faceset');
			}
		},

		/**
		 * Delete a faceset.
		 * @param {string} outer_id - The outer_id of the faceset to delete.
		 */
		async deleteFaceset(outer_id) {
			const alertStore = useAlertStore();
			try {
				// DELETE request to delete the faceset
				await axios.delete(`${baseUrl}/api/faceset/${outer_id}`);
				// Update the list by refetching facesets after deletion
				await this.getAllFacesets();
				alertStore.success('Faceset deleted successfully');
			} catch (error) {
				alertStore.error('There was an issue deleting the faceset.', error.message);
			}
		},

		/**
		 * Add face(s) to a faceset.
		 * @param {string} outer_id - The outer_id of the faceset.
		 * @param {string} face_tokens - Comma-separated face tokens.
		 */
		async addFaceToFaceset(outer_id, face_tokens) {
			const alertStore = useAlertStore();
			try {
				const formData = {
					face_tokens: face_tokens, // Should be a comma-separated string
				};
				const response = await axios.post(`${baseUrl}/api/facesets/${outer_id}/add-face`, formData);

				if (response.status === 200) {
					alertStore.success('Face(s) added to faceset successfully');
					// Optionally fetch the updated faceset details
					await this.getFacesetByOuterId(outer_id);
				}
			} catch (error) {
				alertStore.error('There was an issue adding face(s) to the faceset.', error.message);
			}
		},

		/**
		 * Remove face(s) from a faceset.
		 * @param {string} outer_id - The outer_id of the faceset.
		 * @param {string} face_tokens - Comma-separated face tokens.
		 */
		async removeFaceFromFaceset(outer_id, face_tokens) {
			const alertStore = useAlertStore();
			try {
				const formData = {
					face_tokens: face_tokens, // Should be a comma-separated string
				};
				const response = await axios.post(`${baseUrl}/api/facesets/${outer_id}/remove-face`, formData);

				if (response.status === 200) {
					alertStore.success('Face(s) removed from faceset successfully');
					// Optionally fetch the updated faceset details
					await this.getFacesetByOuterId(outer_id);
				}
			} catch (error) {
				alertStore.error('There was an issue removing face(s) from the faceset.', error.message);
			}
		},

		/**
		 * Clear the form data.
		 */
		clearFormData() {
			// Reset newFormData to its initial state
			this.newFormData = {
				outer_id: '',
				display_name: '',
				tags: '',
				face_tokens: '',
			};
			this.isSubmitting = false;
		},
	},
});
