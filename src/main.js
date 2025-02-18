import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import posthogPlugin from '../plugins/posthog';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import vue3GoogleLogin from 'vue3-google-login';
import config from '@/config';
import { useAuthStore } from '@/stores/authStore';

import App from './App.vue';
import router from './router';

import './assets/index.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(posthogPlugin);

app.use(vue3GoogleLogin, {
	clientId: config.googleClientID,
});

app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			prefix: 'p',
			darkModeSelector: 'false',
			cssLayer: false,
		},
	},
});

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();
	if (!authStore.isAuthenticated) {
		await authStore.initAuth();
	}
	next();
});

app.mount('#app');
