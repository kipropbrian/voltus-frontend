import { fileURLToPath, URL } from 'node:url';
import vueDevTools from 'vite-plugin-vue-devtools';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwind(), autoprefixer()],
		},
	},
	plugins: [vue(), vueDevTools()],
	server: {
		allowedHosts: ['voltus.dev'], // Add your domain here
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
