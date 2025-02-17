// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		token: localStorage.getItem('token'),
		isAuthenticated: false,
	}),

	getters: {
		getUser: (state) => state.user,
		getToken: (state) => state.token,
		isLoggedIn: (state) => state.isAuthenticated,
	},

	actions: {
		async loginWithGoogle(credential) {
			try {
				const response = await axios.post(`${baseUrl}/api/auth/google`, {
					credential,
				});
				console.log('response', response);

				this.setAuth(response.data);
				return response.data;
			} catch (error) {
				this.clearAuth();
				throw error;
			}
		},

		setAuth(data) {
			this.user = data.user;
			this.token = data.token;
			this.isAuthenticated = true;
			localStorage.setItem('token', data.token);

			// Set axios default authorization header
			axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
		},

		async logout() {
			try {
				await axios.post('/api/auth/logout');
			} catch (error) {
				console.error('Logout error:', error);
			} finally {
				this.clearAuth();
			}
		},

		clearAuth() {
			this.user = null;
			this.token = null;
			this.isAuthenticated = false;
			localStorage.removeItem('token');
			delete axios.defaults.headers.common['Authorization'];
		},

		async initAuth() {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
					const response = await axios.get('/api/user');
					this.user = response.data;
					this.isAuthenticated = true;
				} catch (error) {
					this.clearAuth();
				}
			}
		},
	},
});
