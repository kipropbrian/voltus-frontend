import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import posthogPlugin from '../plugins/posthog';

import App from './App.vue';
import router from './router';

import './assets/index.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(posthogPlugin);

app.mount('#app');
