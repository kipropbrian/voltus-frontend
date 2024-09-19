import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
	state() {
		return { alert: null };
	},
	actions: {
		success(message) {
			this.alert = { message, type: 'alert-success' };
			this.autoClear();
		},
		error(message) {
			this.alert = { message, type: 'alert-danger' };
			this.autoClear();
		},
		clear() {
			this.alert = null;
		},
		autoClear() {
			setTimeout(() => {
				this.clear();
			}, 5000); // 5 seconds
		},
	},
});
